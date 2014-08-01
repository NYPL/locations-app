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

To find out more about our tests and to run them, please read the README file in /test.

## Front-end Dependencies

