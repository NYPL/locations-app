# Tests

## End-to-end tests with Protractor 

On the root directory for this repo, run:
  
    $ sudo npm install

to get all the node modules needed for running the tests.

Protractor is built on top of Selenium's WebDriver, and the Jasmine testing framework.  Protractor also requires a separate server running selenium but it's easy to install.

1. After running `npm install`, protractor will download in the node_modules directory.
2. Update the Selenium installation script 

    $ ./node_modules/protractor/bin/webdriver-manager update

3. Start the standalone version of selenium

    $ ./node_modules/protractor/bin/webdriver-manager start

The selenium server will run in the background and now Protractor can connect to it.

The first step is only needed if you're starting a new Protractor test. This file should already exist when cloning this repo.

1. Copy the config file for protractor:

    $ cp ./node_modules/protractor/example/chromeOnlyConf.js protractor_conf.js

2. In the root directory with the webdriver-manager running in the background, run

    $ protractor protractor_chrome_conf.js

or

    $ protractor protractor_ff_conf.js

to run all the tests in Chrome and Firefox, respectively. Tests for different pages are broken up into suites in the configuration file.  To run, for example, just the tests for the division page run:

    $ protractor protractor_chrome_conf.js --suite division

A new browser window should popup and all the tests should run automatically on that new window. The results can be seen in the terminal window where the protractor command was performed.

## Unit tests with Karma

You do not need to start up a server before running the unit tests.

    cd tests
    scripts/test.sh


## More info on testing:

* [ng-newsletter on Protractor](http://www.ng-newsletter.com/posts/practical-protractor.html)
* [Protractor Getting Started](https://github.com/angular/protractor/blob/master/docs/getting-started.md)
* [Protractor API](http://angular.github.io/protractor/#/api)
