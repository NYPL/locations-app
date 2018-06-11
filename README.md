# The Locinator

NYPL's new Locations section.
Features a smart search that filters through 92 different library branches and also geocodes zipcodes and address. There is also a geolocation component for users who are on the go.

Every branch has an updated page layout with events, exhibitions, staff blog posts, featured content, and highlighted amenities. Research branches also display their divisions and divisions now have their own page with their own subdivisions, blog posts, and events.

## Installing Dependencies

### Server
The backend is supported by Sinatra. To get all the Ruby dependencies, run:

    bundle install

### Front-end
Node and npm are needed to install front-end dependencies and tools.

If node is not available on your computer, install it from [nodjs.org](http://nodejs.org/). This is also download and install npm.

To get all the front end dependencies, run:

    bower install

The `.bowerrc` file in the root directory will tell bower to install all the dependencies in `public/bower_components`.

### Tools
To be able to run unit tests, Protractor end-to-end tests, and Grunt commands, run:

    sudo npm install

This will install all the necessary node modules in the `node_modules` directory.

## Environments and Running the app
Checkout the `development` branch and run

    bundle exec rackup

to start the server in the default `development` environment. The app will be available on `http://localhost:9292/`.

### Running different environments
There are four different enviroments that the Locinator can be run in:
* local
* development
* qa
* production

Every enviroment has a set of specific environments variables that the app uses, such as:
* API version
* Google Analytics tracking code
* Optimizely link
* CDN for static files

Running `bundle exec rackup` on each of the development, qa, or production branches will start the app in its respective default development, qa, and production environment.

Since new features are tested on the development branch, we want to switch environments without switching branches. To do so we start the Sinatra app telling it what environment we want in the LOCINATOR_ENV variable.

Running

    LOCINATOR_ENV=development bundle exec rackup

will start the app in the development environment. Likewise, running

    LOCINATOR_ENV=production bundle exec rackup

will start the app in the production environment.

## Front-end Dependencies
A list of all the dependencies used in the Locinator, Locations project.

Third Party
* jQuery
* AngularJs v1.3.15
  * ngSanitize
  * ngAnimate
  * [ui-router](https://github.com/angular-ui/ui-router)
  * [Angulartics](http://luisfarzati.github.io/angulartics/)
  * [Angular Translate](http://angular-translate.github.io/)
  * [newrelic-timing](https://github.com/uken/newrelic-timing)
  * [Underscore.js](http://underscorejs.org/)

NYPL Components
These are internal modules found in [public/scripts/components](public/scripts/components).
* nyplAlerts
  * nypl_alerts.js - Module that provides an AngularJS Provider, Directives and Service methods to sort, filter and display site-wide/location based alerts from a given API endpoint.
* nyplBreadcrumbs
  * nypl_breadcrumbs.js - Module that provides an AngularJS directive for breacrumbs navigation.
* nyplFeedback
  * nypl_feedback.js - Module that provides a small, fixed feedback button on the page that opens up a Survey Monkey survey.
* nyplNavigation
  * nypl_navigation.js - Module that provides an AngularJS directive for the main header navigation and mobile actions.
* nyplSearch
  * nypl_search.js - Module that provides an AngularJS directive for searching on Bibliocommons or on NYPL.org.
* nyplSSO
  * nypl_sso.js - Module that provides an AngularJS directive for displaying the mobile and desktop SSO login and the ability to log on to Bibliocommons on any page.
* locationService
  * nypl_location.api.js - Module that first retrieves the internal configuration variables to call the correct API and its endpoints.
* coordinateService
  * nypl_coordinates.js - Module to check if geolocation is available on the browser, get user current coordinates, and calculate two-point distances.

## Testing :triangular_ruler: :pencil2:
Testing is awesome but is rather complicated to set up. We run two sets of tests for the Locinator.
* Unit tests: Jasmine and Karma are used to test the AngularJs code for the Locinator.
* End-to-end tests: AngularJS's Protractor E2E test framework is used to test the full stack app on different browsers and simulate user interactions.

To find out more about our tests and how to run them, please read the [README file in /test](test).

## Documentation :notebook:
ngdocs, a flavor of jsdoc, is currently being used to document our AngularJS app. Grunt and [grunt-ngdocs](https://www.npmjs.org/package/grunt-ngdocs) are used to run a Grunt ngdocs task and generate documentation as a website.

To generate the documentation website, run:

    grunt ngdocumentation

This will generate an 'ngdoc' folder in the root directory which must be viewed in a server. Perform the following commands to start a very simple server to see the documentation at localhost:8080:

    cd ngdocs
    python -m SimpleHTTPServer 8080

To learn more about how to document, please see [codeDocumentation](codeDocumentation.md).

### Integrate with the styles from NYPLBase

The repo of `NYPLBase` is here.
https://github.com/NYPL/NYPLBase

To integrate with the styles from `NYPLBase`, we have to reference the source of `NYPLBase`, hosted by the `UX-Static` repo.

You can find the repo here,
https://bitbucket.org/NYPL/ux-static/src/master/

And in the root folder of `Locations App`, find the file, `locinator.json`. You will see different environments and their configurations. The configuration of `nyplbase` is the one that points to the stylesheets from `UX-Static`. We have two different sources,

master: `//d2znry4lg8s0tq.cloudfront.net/nyplbase/0.2.0/css/nyplbase.min.css`
staging: `//d3rw2mydk59brd.cloudfront.net/nyplbase/0.2.0/css/nyplbase.min.css`

Change the source for the environment you want to have the styles from `NYPLBase`. Also, make sure version(`0.2.0`, for example) matches the version you want from `UX-Static` repo.

Run `Locations App` in the correct environment, and the updates should be applied.

### Test the styles from NYPLBase locally

We can test how the CSS min files of `NYPLBase` work on `Locations App` directly. First, disable the current stylesheet from Cloudfront in `views/index.erb` by removing or commenting out the line, `<link rel="stylesheet" href="<%= settings.env_config['nyplbase'] %>" type="text/css" media="screen" />`. Second, add `<link rel="stylesheet" href="css/nyplbaseTest.min.css" type="text/css" />` in the same file, `view/index.erb`. Last, create a new file named `nyplbaseTest.min.css` in the folder `public/css` and paste the contents from `nyplbaseTest.min.css` to this folder. To compile the correct `nyplbaseTest.min.css` at `NYPLBase`, please check its documentation.

Run Locations App, it should pick up the styles you created at NYPLBase.
