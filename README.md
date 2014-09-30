# The Locinator

## Installing dependencies
To get all the Ruby dependencies, run:

    bundle install

Then, to get all the front end dependencies:

    bower install

To be able to run unit tests, Protractor end-to-end tests, and Grunt commands, run:

    sudo npm install

## Environments and Running the app
To start a server, `cd` into the top of the cloned repository, run

    bundle exec rackup -p 8000

then go to `http://localhost:8000/`. Alternatively, you can also run

    bundle exec rackup

and then go to `http://localhost:9292/'. These will run with the default production environment.

There are three different enviroments that the Locinator can be run in:
* local
* qa
* production (default if no enviroment is explicitly given)

Every enviroment has a set of specific environments variables that the app uses, such as:
* API version
* Google Analytics tracking code
* Optimizely link
* CDN for static files

## Testing

Testing is awesome but can get rather complicated to set up. We run two sets of tests for the Locinator.
* Unit tests: Jasmine and Karma are used to test the AngularJs code for the Locinator.
* End-to-end tests: AngularJS's Protractor E2E test framework is used to test the full stack app on different browsers.

To find out more about our tests and how to run them, please read the [README file in /test](test).

## Front-end Dependencies

Third Party
* jQuery
* AngularJs
  * ngSanitize
  * ngAnimate
  * [ui-router](https://github.com/angular-ui/ui-router)
  * [angulartics](http://luisfarzati.github.io/angulartics/)
  * [Angular Translate](http://angular-translate.github.io/)

NYPL Components
These can be found in [public/scripts/components](public/scripts/components).
* LocationService
  * nypl_location.api.js - To call the API service.
* CoordinatesService
  * nypl_coordinates.js - For geolocation.
* NYPL_Breadcrumbs
  * nypl_breadcrumbs.js - Module that provides an AngularJS directive for breacrumbs navigation. 
* NYPL_Navigation
  * nypl_navigation.js - Module that provides an AngularJS directive for the main header navigation.
* NYPL_Search
  * nypl_search.js - Module that provides an AngularJS directive for search on Bibliocommons or NYPL.org.
* NYPL_SSO
  * nypl_sso.js - Module that provides an AngularJS directive for displaying the mobile and desktop SSO login.

## Documentation

We are currently still searching for a documentation process that we want to follow. [JSdoc](http://usejsdoc.org/) is currently being used and Grunt and [grunt-jsdoc](https://github.com/krampstudio/grunt-jsdoc) is used to run JSdoc and generate documentation as a website.

Since the Locinator is an AngularJS app, other documentation tools may prove to be more useful, such as [ngdocs](https://www.npmjs.org/package/grunt-ngdocs).

To generate the documentation website, run:

    grunt jsdoc

This will generate a 'doc' folder in the root directory. Open doc/index.html to view the documentation. The grunt-jsdoc task will look through the assigned javascript sources and parse it to generate the documentation.

To learn more about how to document, please see [codeDocumentation](codeDocumentation.md).
