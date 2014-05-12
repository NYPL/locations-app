// An example configuration file.
exports.config = {
  // Do not start a Selenium Standalone sever - only run this using chrome.
  // chromeOnly: true,
  // chromeDriver: './node_modules/protractor/selenium/chromedriver',

  // if you do want a separate running selenium server, comment the two lines above
  // and uncomment this line:
  seleniumAddress: 'http://0.0.0.0:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'firefox'
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  suites: {
    homepage: ['test/e2e/homepage/homepage.spec.js'],
    division: ['test/e2e/division/division.spec.js'],
    map: ['test/e2e/map/map.spec.js']
  },

  baseUrl: 'http://localhost:9292/',

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    isVerbose: true
  }
};
