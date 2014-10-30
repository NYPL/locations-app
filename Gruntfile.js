/*jslint indent: 2, maxlen: 80 */
/*globals module */

module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    jsdoc: {
      dist: {
        src: ['public/scripts/services/*.js',
          'public/scripts/components/*.js'],
        options: {
          destination: 'docs'
        }
      }
    },
    ngdocs: {
      options: {
        dest: 'ngdocs',
        scripts: ['public/bower_components/jquery/jquery.min.js',
          'public/bower_components/angular/angular.js',
          'public/bower_components/angular-sanitize/angular-sanitize.js',
          'public/bower_components/angular-ui-router/release/angular-ui-router.js',
          'public/bower_components/angular-mocks/angular-mocks.js',
          'public/bower_components/angular-animate/angular-animate.min.js',
          'public/bower_components/angularitics/src/angulartics.js',
          'public/bower_components/angularitics/src/angulartics-ga.js',
          'public/bower_components/angular-translate/angular-translate.js',
          'public/bower_components/underscore/underscore.js',
          'public/vendor/jquery.cookies.js',
          'public/scripts/app.js',
          'public/scripts/components/nypl_coordinates.js',
          'public/scripts/components/nypl_locations_api.js',
          'public/scripts/components/nypl_search/nypl_search.js',
          'public/scripts/components/nypl_sso/nypl_sso.js',
          'public/scripts/components/nypl_navigation/nypl_navigation.js',
          'public/scripts/components/nypl_breadcrumbs/nypl_breadcrumbs.js',
          'public/scripts/components/nypl_feedback/nypl_feedback.js',
          'public/scripts/filters/nypl_filters.js',
          'public/scripts/controllers/locations.js',
          'public/scripts/controllers/division.js',
          'public/scripts/controllers/amenities.js',
          'public/scripts/services/nypl_geocoder_service.js',
          'public/scripts/services/nypl_utility_service.js',
          'public/scripts/services/nypl_amenities_service.js',
          'public/scripts/services/nypl_search_service.js',
          'public/scripts/directives/nypl_directives.js'],
        html5Mode: true,
        startPage: '/',
        title: 'Locinator ngDocs',
        image: 'public/images/nypl_logo.png',
        imageLink: 'http://locations.nypl.org',
        titleLink: 'http://locations.nypl.org',
        bestMatch: true,
      },
      all: ['public/scripts/**/*.js']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-ngdocs');

  grunt.registerTask('default', []);

  grunt.registerTask('docs', ['jsdoc']);
  grunt.registerTask('ngdocumentation', ['ngdocs']);

};