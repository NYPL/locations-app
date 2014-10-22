/*jslint nomen: false, indent: 2, maxlen: 80 */
/*globals require, exports, jasmine */

var HtmlReporter = require('protractor-html-screenshot-reporter');

exports.config = {
  // Do not start a Selenium Standalone sever - only run this using chrome.
  // chromeOnly: true,
  // chromeDriver: './node_modules/protractor/selenium/chromedriver',

  // if you do want a separate running selenium server,
  // comment the two lines above and uncomment this line:
  seleniumAddress: 'http://0.0.0.0:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'firefox'
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  suites: {
    homepage: ['test/e2e/homepage/homepage.spec.js'],
    location: ['test/e2e/location/circulating.spec.js',
      'test/e2e/location/research.spec.js'],
    division: ['test/e2e/division/division.spec.js'],
    nyplchat: ['test/e2e/nyplchat/nyplchat.spec.js'],
    amenities: ['test/e2e/amenities/all_amenities.spec.js',
      'test/e2e/amenities/amenity.spec.js',
      'test/e2e/amenities/amenities_at_branch.spec.js'],
    pagetopage: ['test/e2e/page-to-page/page_to_page.spec.js'],
    sso: ['test/e2e/page-to-page/sso_cookies.spec.js'],
    analytics: ['test/e2e/analytics/analytics.spec.js']
  },

  // onPrepare: function () {
  //   'use strict';

  //   // This will generate a screenshot for every test, a json file,
  //   // and an html page with all the results:
  //   jasmine.getEnv().addReporter(new HtmlReporter({
  //     baseDirectory: 'test/results/e2e_html_screenshots'
  //   }));

  //   // Generates an xml file
  //   require('jasmine-reporters');
  //   jasmine.getEnv()
  //     .addReporter(
  //       new jasmine.JUnitXmlReporter('test/results/e2e_xml/', true, true)
  //     );
  // },

  baseUrl: 'http://localhost:9292/',

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    isVerbose: true
  }
};
