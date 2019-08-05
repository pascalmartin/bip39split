const {  When, Then } = require('cucumber');
const assert = require('assert');

var username = process.env.BROWSERSTACK_USERNAME;

When('I open index', function (next) {
  this.driver.get(`http://${username}.browserstack.com/index.html`).then(function () {
    next();
  }).catch(function (error) {
    next(error);
  });
});

When('I open src index', function (next) {
  this.driver.get(`http://${username}.browserstack.com/src%5Cindex.html`).then(function () {
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