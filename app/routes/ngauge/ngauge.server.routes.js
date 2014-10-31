'use strict';

module.exports = function(app) {
  var ngauge = require('../../../app/controllers/ngauge/ngauge');

  app.route('/api/ngauge')
    /** @todo GET return latest completed tweets. */
    .post(ngauge.webhooks);

};