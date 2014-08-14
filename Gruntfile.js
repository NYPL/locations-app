/*jslint indent: 2, maxlen: 80 */
/*globals module */

module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    jsdoc: {
      dist: {
        src: ['public/scripts/services/*.js'],
        options: {
          destination: 'docs'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('default', []);

};