# Chromium browser automation

Extension for automating chromium browser.

## Installation

```bash
npm install
```

### Setting up development environment

- Run one of the commands below
```bash
npm run build:webpack       # builds extension in `dist` directory
npm run build:webpack:watch # builds extension and watches for changes 
build:webpack:prod          # builds production version with minified files
```
- Visit `chrome://extensions` in your browser
- Ensure that the **Developer mode** checkbox in the top right-hand corner is
  checked
- Click **Load unpacked** button
- Locate and load generated `dist` folder in the repository root directory

**Note:** When rebuilding the extension changes in background scripts might not
be loaded in the chrome unless actual extension is reloaded in the
`chrome://extensions` page (i.e. By clicking on the reload button).

## Testing

```bash
npm test                # Run puppeteer test
npm run test:pages      # Starts server with test page used by puppeteer
```

## Publishing

Command below bundles the extension into `cba.zip` file:
```bash
npm run build
```

## Wiki

https://github.com/browser-automation/cba/wiki

## Contribution

### Reporting bugs, suggestions and questions

Use [Github issue tracker](https://github.com/browser-automation/cba/issues) for
requesting features, reporting bugs and questions. See [github issues
documentation](https://guides.github.com/features/issues/).

### Code contribution

Code contributions are welcome, you can always consult with me (in issues, or
PRs) when you have a question. If you are developing a new feature, please
consider creating also tests for them when possible.

### Website changes

Please refer to the [website
repository](https://github.com/browser-automation/cba-website) for contributions
referring to the [chrome-automation.com](https://chrome-automation.com/)
content, layout and/or styles.

### Thanks to the awesome contributors

- [@naarrek](https://github.com/naarrek)
  - For migrating [chrome-automation.com](https://chrome-automation.com) from Drupal
instance to [CMintS](https://cmints.io/) and implementing all necessary changes
for that.
  - For helping with testing Beta version of CBA.
