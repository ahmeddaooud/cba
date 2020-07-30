const assert = require("assert");
const path = require("path");
const equal = assert.strictEqual;
const notEqual = assert.notStrictEqual;
const deepEqual = assert.deepStrictEqual;
const notDeepEqual = assert.notDeepStrictEqual;
const ok = assert.ok;
const notOk = (value) => ok(!value);
const {wait, setPredefinedActions, getElementAttribute,
  getValue, cbaListItemSelect, setValue, cbaListHasTextCount,
  getFunctionFromStorage} = require("./utils");
const {page} = require("../main");

const {NO_FUNCTION_NAME,
  NO_SELECTED_FUNCTION} = require("../../src/js/ui/notification");

const pageSetup = {
  path: "options.html"
}

const addButtonClick = () => page().click("[data-action='addFunction']");
const deleteButtonClick = () => page().click("[data-action='deleteFunction']");
const saveButtonClick = () => page().click("[data-action='saveFunction']");
const optionTabClick = () => page().click("#functions-tab");

const inputNameQuery = "#funcName";
const inputDataQuery = "#funcData";
const inputTypeQuery = "#funcEvType";
const inputValueQuery = "#funcNewValue";

const functionsList = "#functions";

beforeEach(async () =>
{
  await setPredefinedActions();
  await wait(50);
  await page().reload({waitUntil: "domcontentloaded"});
  await wait(50);
  await optionTabClick();
});

it("Selecting function populates inputs accordingly", async() =>
{
  await cbaListItemSelect(functionsList, "Timer");
  await ensureInputValues("Timer", "Please enter the time in milliseconds", "timer", "1000");

  await cbaListItemSelect(functionsList, "Update");
  await ensureInputValues("Update", "this event will let the script wait for page update", "update", "");
});

it("Clicking 'add' button creates new function with specified input data", async() =>
{
  const name = "New function";
  const data = "test1";
  const type = "inject";
  const value = "test2";
  await setInputs(name, data, type, value);
  await addButtonClick();

  const func = await getFunctionFromStorage(name);
  delete func.id;
  deepEqual(func, {text: name, data: {texts: {data, type, value}}})
  
  equal(await cbaListHasTextCount(functionsList, "New function"), 1);
  await cbaListItemSelect(functionsList, "New function");
  await ensureInputValues(name, data, type, value);

  await page().reload({waitUntil: "domcontentloaded"});

  equal(await cbaListHasTextCount(functionsList, "New function"), 1);
  await cbaListItemSelect(functionsList, "New function");
  await ensureInputValues(name, data, type, value);

  await addButtonClick();
  equal(await cbaListHasTextCount(functionsList, "New function"), 2);
});

it("Clicking 'delete' button deletes selected function", async() =>
{
  equal(await cbaListHasTextCount(functionsList, "Update"), 1);
  await cbaListItemSelect(functionsList, "Update");
  await deleteButtonClick();
  equal(await cbaListHasTextCount(functionsList, "Update"), 0);

  await page().reload({waitUntil: "domcontentloaded"});
  equal(await cbaListHasTextCount(functionsList, "Update"), 0);
});

it("Clicking 'save' button updates selected function with the specified input data", async() =>
{
  await cbaListItemSelect(functionsList, "Update");
  const data = "new Data";
  const type = "inject";
  const value = "New value";
  await setValue(inputDataQuery, data);
  await setValue(inputTypeQuery, type);
  await setValue(inputValueQuery, value);
  await saveButtonClick();

  await page().reload({waitUntil: "domcontentloaded"});
  await wait(50);
  await cbaListItemSelect(functionsList, "Update");
  await ensureInputValues("Update", data, type, value);
  equal(await cbaListHasTextCount(functionsList, "Update"), 1);

  await setValue(inputNameQuery, "New function");
  await saveButtonClick();
  equal(await cbaListHasTextCount(functionsList, "Update"), 0);
  await page().reload({waitUntil: "domcontentloaded"});
  equal(await cbaListHasTextCount(functionsList, "Update"), 0);
  equal(await cbaListHasTextCount(functionsList, "New function"), 1);

  await cbaListItemSelect(functionsList, "New function");
  await ensureInputValues("New function", data, type, value);
});

it("Test error messages", async() =>
{
  await addButtonClick();
  equal(await getNotificationMsg(), NO_FUNCTION_NAME);

  await deleteButtonClick();
  equal(await getNotificationMsg(), NO_SELECTED_FUNCTION);

  await saveButtonClick();
  equal(await getNotificationMsg(), NO_SELECTED_FUNCTION);

  await cbaListItemSelect(functionsList, "Update");
  await setValue(inputNameQuery, "");
  await saveButtonClick();
  equal(await getNotificationMsg(), NO_FUNCTION_NAME);
});

function getNotificationMsg()
{
  return getElementAttribute("#panel-functions .notification", "textContent");
}

async function ensureInputValues(name, data, type, value)
{
  const currentName = await getValue(inputNameQuery);
  const currentData = await getValue(inputDataQuery);
  const currentType = await getValue(inputTypeQuery);
  const currentValue = await getValue(inputValueQuery);

  equal(currentName, name);
  equal(currentData, data);
  equal(currentType, type);
  equal(currentValue, value);
}

async function setInputs(name, data, type, value)
{
  await setValue(inputNameQuery, name);
  await setValue(inputDataQuery, data);
  await setValue(inputTypeQuery, type);
  await setValue(inputValueQuery, value);
}

module.exports = {pageSetup};
