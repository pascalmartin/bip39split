const {  When } = require('cucumber');

var username = process.env.BROWSERSTACK_USERNAME;

When('I open index', function (next) {
  this.driver.get(`http://${username}.browserstack.com/src/index.html`).then(function () {
    next();
  }).catch(function (error) {
    next(error);
  });
});