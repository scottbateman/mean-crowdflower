'use strict';

module.exports = function(app) {
  var crowdflower = require('../../../app/controllers/crowdflower/crowdflower');

  /**
   * Endpoint for Crowdflower to send us information.
   */
  app.route('/api/crowdflower')
    .post(crowdflower.webhooks);
};