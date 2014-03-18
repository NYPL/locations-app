module.exports = function(config){
  config.set({
    basePath : '../../',

    files : [
      'public/bower_components/angular/angular.js',
      'public/bower_components/angular-mocks/*.js',
      'public/bower_components/angular-cookies/*.js',
      'public/bower_components/angular-resource/*.js',
      'public/bower_components/angular-sanitize/*.js',
      'public/bower_components/angular-route/*.js',
      'public/bower_components/angular/angular-*.js',
      'public/scripts/**/*.js',
      'test/unit/**/*.js'
    ],

    exclude : [
      'public/bower_components/angular/angular-loader.js',
      'public/bower_components/angular/*.min.js',
      'angular-scenario.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-script-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }
  });
};