Protractor 

I created a package.json file in the root directory in order to save the npm package for protractor. Then I ran:

  npm install protractor --save

When cloning this repo to run tests, just run in the root directory
  
  sudo npm install

to get protractor.

Protractor is built on top of Selenium's WebDriver, and the Jasmine testing framework.  Protractor also requires a separate server running selenium but it's easy to install.

1. After running `npm install`, protractor will download in the node_modules directory.
2. run the Selenium installation script `./node_modules/protractor/bin/webdriver-manager update`
3. start the standalone version of selenium `./node_modules/protractor/bin/webdriver-manager start`

It should start the selenium server in the background and now Protractor can connect to it.

The next step is only needed if you're starting a new Protractor test. This file should already exist when cloning this repo.
# copy the config file for protractor
## cp ./node_modules/protractor/example/chromeOnlyConf.js protractor_conf.js

In the root directory with the webdriver-manager running in the background, run

  protractor protractor_conf.js

to run the tests.  A new browser window should popup and all the tests should run automatically on that new window. The results can be seen in the terminal window where the protractor command was performed.

More info on testing:
http://www.ng-newsletter.com/posts/practical-protractor.html
https://github.com/angular/protractor/blob/master/docs/getting-started.md
