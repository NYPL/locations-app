/*jslint indent: 2, maxlen: 80 */
/*globals module */

module.exports = function (config) {
  'use strict';

  config.set({
    basePath : '../',

    files : [
      // 'components/jquery/dist/jquery.js',
      'components/angular/angular.js',
      'components/angular-mocks/*.js',
      'components/angular-sanitize/*.js',
      'components/underscore/underscore.js',
      'components/angular-ui-router/release/*.js',
      'components/moment/min/moment-with-locales.min.js',
      'components/moment-timezone/builds/moment-timezone-with-data.min.js',
      'nypl_alerts.js',
      'test/unit/*.js',
    ],

    exclude : [],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-script-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-coverage'
    ],

    reporters: ['progress', 'coverage'],

    preprocessors: {
      'nypl_alerts.js': ['coverage']
    },
    
    coverageReporter: {
      type: 'html',
      dir: 'test/coverage/'
    },

    // ngHtml2JsPreprocessor: {
    //   stripPrefix: 'public/',
    //   moduleName: 'directiveTemplates'
    // }
  });
};
