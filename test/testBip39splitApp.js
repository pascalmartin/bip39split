'use strict';
const fs = require('fs');
const webdriver = require('selenium-webdriver');
const { username, accessKey, caps } = require('../browserstackEnv');

const MILLISECONDE = 1;
const SECONDE = 1000 * MILLISECONDE;
const MINUTE = 60 * SECONDE;

describe('Test bip39split App in multiple browser', function () {

    let generatedTestDatas = [];

    caps.forEach(function (cap) {

        describe(`Test on ${cap.testName}`, function () {

            var driver = null;
            before('Init webdriver', function () {
                driver = new webdriver.Builder().usingServer(`https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`).withCapabilities(cap).build();
            });

            it('Test get index.html', function () {
                this.timeout(2 * MINUTE);
                return driver.get(`http://${username}.browserstack.com/index.html`).then(function () {
                    return driver.getPageSource().then(function (source) {
                        source.should.containEql('Tool to create fragmented paper backup of your bip39 mnemonic phrase.');
                    });
                });
            });

            it('Test get src/index.html', function () {
                this.timeout(2 * MINUTE);
                return driver.get(`http://${username}.browserstack.com/src/index.html`).then(function () {
                    return driver.getPageSource().then(function (source) {
                        source.should.containEql('Tool to create fragmented paper backup of your bip39 mnemonic phrase.');
                    });
                });
            });

            it('Test get test/index.html', function () {
                const MAX_ALL_TEST_EXECUTION_TIME = 9 * MINUTE;
                this.timeout(MAX_ALL_TEST_EXECUTION_TIME + (10 * SECONDE));

                return driver.get(`http://${username}.browserstack.com/test/index.html`).then(function () {
                    return driver.wait(webdriver.until.elementLocated(webdriver.By.id('test-failures')), MAX_ALL_TEST_EXECUTION_TIME).getText();
                }).then(function (testFailuresElementText) {
                    testFailuresElementText.should.be.eql('0');
                    return driver.wait(webdriver.until.elementLocated(webdriver.By.id('test-success')), 3 * SECONDE).getText();
                }).then(function (testSuccessElementText) {
                    testSuccessElementText.should.be.greaterThan(0);
                    return driver.wait(webdriver.until.elementLocated(webdriver.By.id('generated-test-data')), 3 * SECONDE).getText();
                }).then(function (generatedTestDataText) {
                    var generatedTestData = JSON.parse(generatedTestDataText)
                    generatedTestData.forEach(function (testData) {
                        testData.generateOn = cap.testName;
                    });
                    generatedTestDatas = generatedTestDatas.concat(generatedTestData);
                });
            });

            after('Quit webdriver', function () {
                this.timeout(1 * MINUTE);
                return driver.quit();
            });
        });

        after('Save test data', function (done) {
            fs.writeFile("./test/data/data-v0.0.x.json", JSON.stringify({
                version: '0.0.x',
                tests: generatedTestDatas
            }), function (err) {
                done(err);
            });
        });

    });
});