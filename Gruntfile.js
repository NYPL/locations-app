/*jslint indent: 2, maxlen: 80 */
/*globals module */

module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    locinator: 
"__                                            __    \n" +
"/\\ \\                      __                  /\\ \\__\n" +
"\\ \\ \\        ___     ___ /\\_\\    ___      __  \\ \\ ,_\\   ___   _ __\n" +
" \\ \\ \\  __  / __`\\  /'___\\/\\ \\ /' _ `\\  /'__`\\ \\ \\ \\/  / __`\\/\\`'__\\\n" +
"  \\ \\ \\_\\ \\/\\ \\_\\ \\/\\ \\__/\\ \\ \\/\\ \\/\\ \\/\\ \\_\\.\\_\\ \\ \\_/\\ \\_\\ \\ \\ \\/ \n" +
"   \\ \\____/\\ \\____/\\ \\____\\\\ \\_\\ \\_\\ \\_\\ \\__/.\\_\\\\ \\__\\ \\____/\\ \\_\\ \n" +
"    \\/___/  \\/___/  \\/____/ \\/_/\\/_/\\/_/\\/__/\\/_/ \\/__/\\/___/  \\/_/ \n",
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
          'public/dist/locinator.annotate.js': ['public/scripts/**/*.js'],
          'public/dist/widget.annotate.js': [
            'public/scripts/components/nypl_coordinates.js',
            'public/scripts/components/nypl_locations_api.js',
            'public/scripts/app.js',
            'public/scripts/filters/nypl_filters.js',
            'public/scripts/controllers/widget.js',
            'public/scripts/directives/nypl_directives.js',
            'public/scripts/services/nypl_utility_service.js'
          ]
        }
      }
    },
    uglify: {
      options: {
        mangle: false,
        banner: "/*!\n <%= locinator %>*/\n"
      },
      dist: {
        files: {
          'public/dist/locinator.min.js': ['public/dist/locinator.annotate.js'],
          'public/dist/widget.min.js': ['public/dist/widget.annotate.js']
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