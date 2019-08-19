'use strict';
const path = require('path');
const browserstack = require('browserstack-local');
const { localIdentifier, accessKey } = require('../browserstackEnv');

const MILLISECONDE = 1;
const SECONDE = 1000 * MILLISECONDE;
const MINUTE = 60 * SECONDE;

var bs_local = null;
before("Start BrowserStackLocal", function (done) {
    this.timeout(2 * MINUTE);

    var folder = path.resolve(__dirname, '..') + '/';
    console.log(`Start BrowserStackLocal with local folder: ${folder}`);
    bs_local = new browserstack.Local();
    bs_local.start({ key: accessKey, folder: folder, localIdentifier: localIdentifier, force: true }, function (error) {
        console.log("  >> Started BrowserStackLocal");
        done(error);
    });
});

after("Stop BrowserStackLocal", function (done) {
    this.timeout(2 * MINUTE);

    console.log("Stop BrowserStackLocal");
    bs_local.stop(function (error) {
        console.log("  >> Stopped BrowserStackLocal");
        done(error);
    });
});
