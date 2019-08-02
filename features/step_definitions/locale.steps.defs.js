'use strict';
const path = require('path')
const assert = require('assert');
const webdriver = require('selenium-webdriver');
const browserstack = require('browserstack-local');
const { AfterAll, BeforeAll, Before, Given, When, Then, setDefaultTimeout } = require('cucumber');

var config_file = '../../cucumber.js';
var config = require(config_file).config;

var username = process.env.BROWSERSTACK_USERNAME;
var accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

var createBrowserStackSession = function (config, caps) {
  return new webdriver.Builder().
    usingServer(`https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`).
    withCapabilities(caps).
    build();
}

var bs_local = null;
var driver = null;

setDefaultTimeout(60 * 1000);

// Asynchronous Callback
BeforeAll({ timeout: 120 * 1000 }, function (callback) {
  var task_id = parseInt(process.env.TASK_ID || 0);
  var caps = config.capabilities[task_id];

  if (caps["bstack:options"] && caps["bstack:options"]['local']) {
    // Code to start browserstack local before start of test and stop browserstack local after end of test
    bs_local = new browserstack.Local();
    bs_local.start({ key: accessKey, folder: path.resolve(__dirname, '../../'), force: true }, function (error) {
      if (error) {
        console.log(error);
        callback(error);
        return;
      }

      driver = createBrowserStackSession(config, caps);
      callback();
    });
  }
  else {
    driver = createBrowserStackSession(config, caps);
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
        next(err.generatedMessage);
      }
    }).catch(function (error) {
      next(error);
    });
});