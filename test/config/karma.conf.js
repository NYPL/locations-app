/*jslint indent: 2, maxlen: 80 */
/*globals module */

module.exports = function (config) {
  'use strict';

  config.set({
    basePath : '../../',

    files : [
      'public/bower_components/jquery/dist/jquery.js',
      'public/bower_components/angular/angular.js',
      'public/bower_components/angular-mocks/angular-mocks.js',
      'public/bower_components/angular-sanitize/angular-sanitize.js',
      'public/bower_components/angular-ui-router/release/*.js',
      'public/bower_components/moment/min/moment-with-locales.min.js',
      'public/bower_components/moment-timezone/builds/moment-timezone-with-data.min.js',
      'public/bower_components/underscore/underscore.js',
      'public/bower_components/angularitics/src/angulartics.js',
      'public/bower_components/angularitics/src/angulartics-ga.js',
      // 'public/bower_components/angular-translate/angular-translate.min.js',
      // 'public/bower_components/angular-translate-loader-static-files/' +
      //   'angular-translate-loader-static-files.min.js',
      'public/bower_components/angular-animate/angular-animate.js',
      'public/bower_components/newrelic-timing/newrelic-timing.min.js',
      'public/bower_components/newrelic-timing/newrelic-timing-angular.min.js',
      'public/scripts/app.js',
      'public/scripts/components/nypl_alerts/nypl_alerts.js',
      'public/scripts/components/nypl_breadcrumbs/*.js',
      'public/scripts/components/nypl_feedback/*.js',
      'public/scripts/components/nypl_navigation/*.js',
      'public/scripts/components/nypl_search/*.js',
      'public/scripts/components/nypl_sso/*.js',
      'public/scripts/components/*.js',
      'public/scripts/controllers/*.js',
      'public/scripts/directives/*.js',
      'public/scripts/filters/*.js',
      'public/scripts/services/*.js',
      'public/scripts/app.js',
      'public/scripts/directives/templates/*.html',
      'public/scripts/components/**/*.html',
      'test/unit/**/*.js'
    ],

    exclude : [
      'public/scripts/components/nypl_alerts/components/**/*.js',
      'public/scripts/components/nypl_alerts/node_modules/**/*.js',
      'public/scripts/components/nypl_alerts/test/**/*.js',
      'public/bower_components/angular/angular-loader.js',
      'public/bower_components/angular/*.min.js',
      'angular-scenario.js',
      'public/languages/*.json'
      // 'test/unit/components/*.js'
      // 'test/unit/controllers/*.js'
      // 'test/unit/directives/*.js'
      // 'test/unit/filters/*.js'
      // 'test/unit/services/*.js'
      // 'test/unit/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['ChromeHeadless', 'FirefoxHeadless'],

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

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    preprocessors : {
      'public/scripts/directives/templates/*.html': ['ng-html2js'],
      'public/scripts/components/**/*.html': ['ng-html2js'],
      'public/scripts/**/*.js': ['coverage']
    },
    
    coverageReporter: {
      type: 'html',
      dir: 'test/coverage/'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'public/',
      moduleName: 'directiveTemplates'
    }
  });
};
