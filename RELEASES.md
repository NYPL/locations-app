# TAG 1.2.2
* Added grunt-ng-annotate and grunt-contrib-uglify to build a minified files for the app and widget AngularJS code. Update to index.erb so it outputs the correct minified or full source.
* More unit and E2E tests.
* Update to the readme for running the app and testing.
* Updating the base href in index.erb so that it has the correct base url in the AWS environment and the reverse proxy environment.
* Moved /config http request to global variable in index.erb.
* Added ngdocs, a version of jsdoc specifically for AngularJS projects, and documentation in the app.
* Added New Relic snippets to QA and Production environment.
* Added Queens Public Library and Brooklyn Public Library images and link.
* Update to the Locations navigation menu.
* Modifying GA analytics pageview so `/locations` is added before every pageview - for the reverse proxy.
* Removed Survey Monkey feedback tab.
* Update to robot.txt to allow all user agents.
* Updated NYPLBase version.
* Update styling to the widget.
* Update to SEO pages with better links and OG tags.
* Added GA event tracking to the header buttons, header search, and SSO events.
* Update to Optimizely url and GA tracking code for the production environment.

