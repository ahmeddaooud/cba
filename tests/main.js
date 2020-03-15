const puppeteer = require("puppeteer");
const extensionPath = "dist";
const tests = [
  {path:"inject.js", name: "TBA"}
];

let browser;
let page;
let backgroundPage;

function run()
{
  for (const {path, name} of tests)
  {
    describe(name, () => {
      const {pageSetup} = require(`./tests/${path}`);
      before(async () =>
      {
        browser = await puppeteer.launch({headless: false, args: [
          `--disable-extensions-except=${extensionPath}`,
          `--load-extension=${extensionPath}`
        ]});
        page = await browser.newPage();
        const extensionName = "Chromium browser automation";
        const targets = await browser.targets();
        const backgroundPageTarget = targets.find(({ _targetInfo }) => _targetInfo.title === extensionName && _targetInfo.type === "background_page");
        backgroundPage = await backgroundPageTarget.page();

        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36");
        await page.goto("http://127.0.0.1:3001");
        await page.evaluate((bodyHTML) => document.body.innerHTML = bodyHTML, pageSetup.body);
      });
      after(async () =>
      {
        // await browser.close();
      })
    });
  }
}

module.exports = {backgroundPage: () => backgroundPage, page: () => page, run};
