/*jslint indent: 2, maxlen: 80 */
/*globals module */

module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsdoc: {
      dist: {
        src: ['public/scripts/services/*.js',
          'public/scripts/components/*.js'],
        options: {
          destination: 'docs'
        }
      }
    },
    ngAnnotate: {
      locinator: {
        files: {
          'public/dist/app.annotate.js': ['public/scripts/**/*.js']
        }
      }
    },
    uglify: {
      options: {
        mangle: false,
        banner: "/* __                                            __    \n" +
"  /\\ \\                      __                  /\\ \\__                \n" +
"  \\ \\ \\        ___     ___ /\\_\\    ___      __  \\ \\ ,_\\   ___   _ __  \n" +
"   \\ \\ \\  __  / __`\\  /'___\\/\\ \\ /' _ `\\  /'__`\\ \\ \\ \\/  / __`\\/\\`'__\\\n" +
"    \\ \\ \\_\\ \\/\\ \\_\\ \\/\\ \\__/\\ \\ \\/\\ \\/\\ \\/\\ \\_\\.\\_\\ \\ \\_/\\ \\_\\ \\ \\ \\/ \n" +
"     \\ \\____/\\ \\____/\\ \\____\\\\ \\_\\ \\_\\ \\_\\ \\__/.\\_\\\\ \\__\\ \\____/\\ \\_\\ \n" +
"      \\/___/  \\/___/  \\/____/ \\/_/\\/_/\\/_/\\/__/\\/_/ \\/__/\\/___/  \\/_/ */\n" +
"/*! Locinator <%= grunt.template.today('mm-dd-yyyy') %> */\n"
      },
      dist: {
        files: {
          'public/dist/locinator.min.js': ['public/dist/app.annotate.js']
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('buildJS', [
    'ngAnnotate', 'uglify'
  ]);

};