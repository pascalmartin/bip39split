'use strict';
var crypto = require('crypto');
const path = require('path');
const webdriver = require('selenium-webdriver');
const browserstack = require('browserstack-local');
const { AfterAll, BeforeAll, Before, setDefaultTimeout } = require('cucumber');

var username = process.env.BROWSERSTACK_USERNAME;
var accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
var localIdentifier = process.env.BROWSERSTACK_LOCAL_IDENTIFIER;
var sessionIdentifier = "travis";
var onTravis = true;

var randomValueHex = function(len) {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString('hex') // convert to hexadecimal format
    .slice(0, len) // return required number of characters
};

if (!localIdentifier){
  onTravis = false;  
  localIdentifier = "dev-" + randomValueHex(24);
  sessionIdentifier = "dev";
}
console.log(`browserstack onTravis: ${onTravis} localIdentifier: ${localIdentifier}`);
console.log(`TRAVIS_BUILD_WEB_URL=${process.env.TRAVIS_BUILD_WEB_URL}`);
console.log(`TRAVIS_BUILD_NUMBER=${process.env.TRAVIS_BUILD_NUMBER}`);
console.log(`TRAVIS_JOB_NUMBER=${process.env.TRAVIS_JOB_NUMBER}`);
console.log(`TRAVIS_BRANCH=${process.env.TRAVIS_BRANCH}`);
console.log(`TRAVIS_COMMIT=${process.env.TRAVIS_COMMIT}`);
console.log(`TRAVIS_COMMIT_MESSAGE=${process.env.TRAVIS_COMMIT_MESSAGE}`);
console.log(`TRAVIS_PULL_REQUEST=${process.env.TRAVIS_PULL_REQUEST}`);
console.log(`TRAVIS_PULL_REQUEST_BRANCH=${process.env.TRAVIS_PULL_REQUEST_BRANCH}`);
console.log(`TRAVIS_PULL_REQUEST_SHA=${process.env.TRAVIS_PULL_REQUEST_SHA}`);
console.log(`TRAVIS_PULL_REQUEST_SLUG=${process.env.TRAVIS_PULL_REQUEST_SLUG}`);


var caps = {
    'browserName': 'Chrome',                
    'browserstack.use_w3c': true,
    'browserstack.localIdentifier': localIdentifier,
    'bstack:options': {
        'os': 'Windows',
        'osVersion': '7',
        'sessionName': `bip39split-${sessionIdentifier}`,
        'buildName': 'cucumber-js-browserstack',
        'projectName': 'bip39split',
        'debug': true,
        'local': true
    },
};



var createBrowserStackSession = function (caps) {
  return new webdriver.Builder().
    usingServer(`https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`).
    withCapabilities(caps).
    build();
};

var bs_local = null;
var driver = null;

setDefaultTimeout(60 * 1000);

// Asynchronous Callback
BeforeAll({ timeout: 120 * 1000 }, function (callback) {
  var folder = path.resolve(__dirname, '..', '..');
  
  if (!onTravis) {
    // Code to start browserstack local before start of test and stop browserstack local after end of test
    console.log(`browserstack local folder: ${folder}`);
    bs_local = new browserstack.Local();
    bs_local.start({ key: accessKey, folder: folder, localIdentifier: localIdentifier, force : true }, function (error) {
      if (error) {
        console.log(error);
        callback(error);
        return;
      }

      driver = createBrowserStackSession(caps);
      callback();
    });
  }
  else {
    driver = createBrowserStackSession(caps);
    callback();
  }
});

// Asynchronous Promise
AfterAll(function (callback) {
  driver.quit().then(function () {
    if (bs_local) {
      bs_local.stop(callback);
    }
    else {
      callback();
    }
  }).catch(function (error) {
    callback(error);
  });
});

Before(function () {
  this.driver = driver;
});