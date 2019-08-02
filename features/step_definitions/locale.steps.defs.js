'use strict';
var crypto = require('crypto');
const path = require('path');
const assert = require('assert');
const webdriver = require('selenium-webdriver');
const browserstack = require('browserstack-local');
const { AfterAll, BeforeAll, Before, Given, When, Then, setDefaultTimeout } = require('cucumber');

var username = process.env.BROWSERSTACK_USERNAME;
var accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
var localIdentifier = process.env.BROWSERSTACK_LOCAL_IDENTIFIER;
var onTravis = true;

var randomValueHex = function(len) {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString('hex') // convert to hexadecimal format
    .slice(0, len) // return required number of characters
};

if (!localIdentifier){
  onTravis = false;  
  localIdentifier = "dev_" + randomValueHex(24);
}
console.log(`browserstack onTravis: ${onTravis} localIdentifier: ${localIdentifier}`);

//caps['browserstack.localIdentifier'] = ENV['BROWSERSTACK_LOCAL_IDENTIFIER']

var caps = {
    'browserName': 'Chrome',                
    'browserstack.use_w3c': true,
    'browserstack.localIdentifier': localIdentifier,
    'bstack:options': {
        'os': 'Windows',
        'osVersion': '7',
        'sessionName': 'local_test',
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
    bs_local.start({ key: accessKey, folder: folder, localIdentifier: localIdentifier }, function (error) {
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
    next(error);
  });;
});

Before(function () {
  this.driver = driver;
});


When('I open health check', function (next) {
  this.driver.get('http://bs-local.com:45691/check').then(function () {
    next();
  }).catch(function (error) {
    next(error);
  });
});

Then('I should see {string}', { timeout: 120 * 1000 }, function (sourceMatch, next) {
  this.driver.getPageSource()
    .then(function (source) {
      try {
        assert.strictEqual(source.indexOf(sourceMatch) > -1, true, 'Expected source to contain ' + sourceMatch);
        next();
      } catch (err) {
        next(' >> ' + err);
      }
    }).catch(function (error) {
      next(error);
    });
});