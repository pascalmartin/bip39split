'use strict';
const should = require('should');
const async = require("async");
const webdriver = require('selenium-webdriver');
const { username, accessKey, caps } = require('../browserstackEnv');

describe('Test bip39split App in multiple browser', function () {

  caps.forEach(function (cap) {

    describe(`Test on ${cap.testName}`, function () {

      var driver = null;
      before('Init webdriver', function () {
        driver = new webdriver.Builder().usingServer(`https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`).withCapabilities(cap).build();
      });

      it('Test get index.html', function () {
        this.timeout(120 * 1000);
        return driver.get(`http://${username}.browserstack.com/index.html`).then(function () {
          return driver.getPageSource().then(function (source) {
            source.should.containEql('Tool to create fragmented paper backup of your bip39 mnemonic phrase.');
          });
        });
      });


      it('Test get src/index.html', function () {
        this.timeout(120 * 1000);
        return driver.get(`http://${username}.browserstack.com/src/index.html`).then(function () {
          return driver.getPageSource().then(function (source) {
            source.should.containEql('Tool to create fragmented paper backup of your bip39 mnemonic phrase.');
          });
        });
      });

      after('Quit webdriver', function () {
        this.timeout(120 * 1000);
        return driver.quit();
      });
    });

  });
});