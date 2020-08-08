const {saveState} = require("../db/projects");
const customActionsDb = require("../db/customActions");

function getOldData()
{
  const data = JSON.parse(localStorage.getItem("data"));
  const settings = JSON.parse(localStorage.getItem("settings"));
  const cbaFunctions = JSON.parse(localStorage.getItem("cba-functions"));
  return {data, settings, cbaFunctions};
}

/**
 * CBA previously were using windows.localStorage, here we ensure that user
 * won't loose their old data if migration to Chrome.storage API won't go well.
 */
async function backup() {
  const {data, settings, cbaFunctions} = getOldData();
  if (data || settings || cbaFunctions) {
    const backup = {data, settings, cbaFunctions};
    await browser.storage.local.set({backup});
  }
}

function migrateActions(actions) {
  if (actions && actions.length) {
    return actions.map(({data, evType, newValue}) => { 
      return {texts: {data, type: evType, value: newValue}};
    });
  }
  else {
    return [];
  }
}

function migrateProjects({projects}, groupName) {
  if (projects && projects.length) {
    return projects.map(({name, action}) => {
      const id = groupName ? `${groupName}_${name}` : name;
      return {
        id,
        text: name, 
        actions: migrateActions(action), type: "project"}
    });
  }
  else {
    return [];
  }
}

function migrateData(oldData) {
  const groups = [];
  for (const groupName of Object.keys(oldData)) {
    const group = {
      "text": groupName,
      "id": groupName,
      "expanded": false,
      "subItems": migrateProjects(oldData[groupName], groupName),
      "type": "group"
    };
    groups.push(group);
  }
  return groups;
}

async function migrate() {
  const {data, cbaFunctions} = getOldData();
  if (data) {
    await saveState(migrateData(data));
  }
  if (cbaFunctions) {
    const customActions = [];
    for (const {name, data, evType, newValue} of cbaFunctions) {
      customActions.push({
        data: {texts: {data, type: evType, value: newValue}},
        text: name
      });
    }
    await customActionsDb.saveState(customActions);
  }
}

module.exports = {migrate, backup, migrateData, migrateProjects};
