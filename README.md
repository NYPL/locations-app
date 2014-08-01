# The Locinator

To get all the Ruby dependencies, run:

    bundle install

Then, to get all the front end dependencies:

    bower install

To be able to run unit tests and Protractor end-to-end tests, run:

    npm install

To start a server, `cd` into the top of the cloned repository, run

    bundle exec rackup -p 8000

then go to `http://localhost:8000/`. Alternatively, you can also run

    rackup

and then go to `http://localhost:9292/'.


## Testing

Testing is awesome but can get rather complicated to set up. We run two sets of tests for the Locinator.
* Unit tests: Jasmine and Karma are used to test the AngularJs code for the Locinator
* End-to-end tests: AngularJs' Protractor E2E test framework is used to test the full stack app on different browsers.

To find out more about our tests and to run them, please read the [README file in /test](test).

## Front-end Dependencies

Third Party
* jQuery
* AngularJs
  * ngResource
  * ngSanitize
  * ngRoute
  * ngAnimate
* [angulartics](http://luisfarzati.github.io/angulartics/)
  * angulartics.google.analytics
* [Angular Translate](http://angular-translate.github.io/)
* [ng-breadcrumbs](http://ianwalter.github.io/ng-breadcrumbs/#/)

NYPL Components
These can be found in [public/scripts/components](public/scripts/components).
* LocationService
  * nypl_location.api.js - To call the API service.
* CoordinatesService
  * nypl_coordinates.js - For geolocation.
* NYPL_Navigation
  *  nypl_navigation.js - Module that provides an AngularJS directive for the main header navigation.
* NYPL_Search
  * nypl_search.js - Module that provides an AngularJS directive for search on Bibliocommons or NYPL.org.
* NYPL_SSO
  * nypl_sso.js - Module that provides an AngularJS directive for displaying the mobile and desktop SSO login.
