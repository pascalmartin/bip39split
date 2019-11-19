'use strict';
const { version } = require('./package.json');
const crypto = require('crypto');

var username = process.env.BROWSERSTACK_USERNAME;
var accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
var localIdentifier = "";
var sessionIdentifier = "";
var buildName = "";
var onTravis = false;

var randomValueHex = function (len) {
    return crypto
        .randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len) // return required number of characters
};

if (process.env.TRAVIS_BUILD_NUMBER) {
    onTravis = true;
    localIdentifier = process.env.BROWSERSTACK_LOCAL_IDENTIFIER || `travis-${process.env.TRAVIS_BUILD_NUMBER}-${process.env.TRAVIS_JOB_NUMBER}`;
    sessionIdentifier = "travis";
    buildName = localIdentifier;
} else {
    localIdentifier = "dev-" + randomValueHex(24);
    sessionIdentifier = "dev";
    var now = new Date();
    buildName = "dev-" + version + "-" +
        now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        '-' +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0');
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

var envs = [{
    'os': 'Windows',
    'osVersion': '10',
    'browsers': ['Chrome', 'Firefox', 'Edge']
}, {
    'os': 'OS X',
    'osVersion': 'Catalina',
    'browsers': ['Chrome', 'Firefox', 'Safari']
}, {
    'deviceName': 'iPad Pro 12.9 2018',
    'osVersion': '13',
    'realMobile': 'true',
    'browserName': 'Safari'
}, {
    'deviceName': 'iPhone XS',
    'osVersion': '13',
    'realMobile': 'true',
    'browserName': 'Safari'
}, {
    'deviceName': 'Samsung Galaxy S9 Plus',
    'osVersion': '9.0',
    'realMobile': 'true',
    'browserName': 'Chrome'
}, {
    'deviceName': 'Google Pixel 3 XL',
    'osVersion': '9.0',
    'realMobile': 'true',
    'browserName': 'Chrome'
}];
/*
envs = [{
    'os': 'Windows',
    'osVersion': '10',
    'browsers': ['Chrome']
}];
envs = [{
    'deviceName': 'iPad Pro 12.9 2018',
    'osVersion': '13',
    'realMobile': 'true',
    'browserName': 'Safari'
}];
*/
//envs = [];

var caps = [];
envs.forEach(function (env) {
    if (env.browsers) {
        env.browsers.forEach(function (browser) {
            caps.push({
                'testName': `${env.os} ${env.osVersion} ${browser}`,
                'browserName': browser,
                'browserstack.use_w3c': true,
                'browserstack.localIdentifier': localIdentifier,
                'browserstack.console': 'verbose',
                'bstack:options': {
                    'os': env.os,
                    'osVersion': env.osVersion,
                    'sessionName': `bip39split-${sessionIdentifier}-${env.os}-${env.osVersion}-${browser}`,
                    'buildName': buildName,
                    'projectName': 'bip39split',
                    'debug': true,
                    'local': true
                },
            });
        });
    } else if (env.realMobile) {
        caps.push({
            'testName': `${env.deviceName} ${env.osVersion}`,
            'browserName': env.browserName,
            'browserstack.use_w3c': true,
            'browserstack.localIdentifier': localIdentifier,
            'browserstack.console': 'verbose',
            'bstack:options': {
                'osVersion': env.osVersion,
                'deviceName': env.deviceName,
                'realMobile': env.realMobile,
                'sessionName': `bip39split-${sessionIdentifier}-${env.deviceName}-${env.osVersion}`,
                'buildName': buildName,
                'projectName': 'bip39split',
                'debug': true,
                'local': true,
                'networkLogs': 'true'
            }
        });
    }
});

module.exports = {
    localIdentifier: localIdentifier,
    buildName: buildName,
    sessionIdentifier: sessionIdentifier,
    username: username,
    accessKey: accessKey,
    caps: caps
};