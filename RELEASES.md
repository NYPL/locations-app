## Tag v1.11.0
* Add CD/CI pipline for deployment.
* Update test script to support testing with headless browsers and optional single-run mode.
* Update styles for focus outline for better accessibility.
* Update the structure of location and division pages to remove duplicated links.
* Update `<main>` tag for better accessibility performance.
* Update the texts for `See more` buttons on location and division pages.
* Update the HTML element structure that make up the breadcrumbs component.
* Update the contents and add the heading for `Ask NYPL` sections in all the pages.
* Remove the abbreviations for days and months.
* Update the headings of different sections from all caps to capitalized.

## Tag v1.10.1
* Update the NYPLBase version to 0.2.0.

## Tag v1.10.0
* Update the gem json version to 2.1.0.
* Update colors for accessibility performance.
* Update the headings of individual location pages and research division pages for accessibility performance.
* Removed tab behavior that didn't allow tabbing out of autofill search input component.
* Update to enable `Make an Appointment` button for General Research Division.
* Update Footer to v1.0.2.

## Tag v1.2.4
* LOC-474 Update GA events for footer links. Made links relative so that duplicates do not show up in GA.
* Update to widget link that goes to the new locations pages.
* Line-height NYPLBase fix for input fields
* Added homepage list view top border on mobile view.
* Added an array length check to sitewide alerts utility.
* More unit and E2E tests. Upgrading to protractor v 1.4.0.

## Tag v1.2.3
* Removing library manager reference in Division SEO template.

## Tag v1.2.2
* LOC-416 Added grunt-ng-annotate and grunt-contrib-uglify to build a minified files for the app and widget AngularJS code. Update to index.erb so it outputs the correct minified or full source.
* More unit and E2E tests.
* Update to the readme for running the app and testing.
* Updating the base href in index.erb so that it has the correct base url in the AWS environment and the reverse proxy environment.
* Moved /config http request to global variable in index.erb.
* Added ngdocs, a version of jsdoc specifically for AngularJS projects, and documentation in the app.
* Added New Relic snippets to QA and Production environment.
* LOC-439 Added Queens Public Library and Brooklyn Public Library images and link.
* Update to the Locations navigation menu.
* Modifying GA analytics pageview so `/locations` is added before every pageview - for the reverse proxy.
* Removed Survey Monkey feedback tab.
* Update to robot.txt to allow all user agents.
* LOC-400 LOC-470 Updated NYPLBase version.
* LOC-455 Update styling to the widget.
* LOC-436 Added meta tags to SEO pages.
* Update to SEO pages with better links.
* LOC-472 Added GA event tracking to the header buttons, header search, and SSO events.
* Update to Optimizely url and GA tracking code for the production environment.

