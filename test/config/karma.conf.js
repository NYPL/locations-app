/*jslint indent: 2, maxlen: 80 */
/*globals module */

module.exports = function (config) {
  'use strict';

  config.set({
    basePath : '../../',

    files : [
      'public/bower_components/angular/angular.js',
      'public/bower_components/angular-mocks/*.js',
      'public/bower_components/angular-cookies/*.js',
      'public/bower_components/angular-resource/*.js',
      'public/bower_components/angular-sanitize/*.js',
      'public/bower_components/angular-route/*.js',
      'public/scripts/**/*.js',
      'public/scripts/directives/templates/*.html',
      'test/unit/**/*.js',
      'public/bower_components/underscore/underscore.js',
      'public/bower_components/angularitics/src/angulartics.js',
      'public/bower_components/angularitics/src/angulartics-ga.js',
      'public/bower_components/angular-translate/angular-translate.min.js',
      'public/bower_components/ng-breadcrumbs/dist/ng-breadcrumbs.min.js',
      'public/bower_components/angular-translate-loader-static-files/' +
        'angular-translate-loader-static-files.min.js',
      'public/bower_components/angular-animate/angular-animate.js'
      // {pattern: 'public/languages/*.json', 
      //     watched: true, served: true, included: false}
    ],

    exclude : [
      'public/bower_components/angular/angular-loader.js',
      'public/bower_components/angular/*.min.js',
      'angular-scenario.js',
      'public/languages/*.json'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-script-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    preprocessors : {
      'public/scripts/directives/templates/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'public/',
      // cacheIdFromPath: function (filepath) {
      //   return filepath.substr(filepath.indexOf('locations-prototype')+8);
      // },

      moduleName: 'directiveTemplates'
    }
  });
};