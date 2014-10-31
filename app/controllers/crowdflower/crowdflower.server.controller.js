'use strict';

var _ = require('lodash');

/**
 * Crowdflower Webhook.
 *
 * Provides an endpoint for Crowdflower to send us information.
 */
exports.webhooks = function(req, res) {
  if(req.body.signal === 'unit_complete'){
    /**
     * @todo Find the unit's data object.
     * @todo Find the DataStep of that data object.
     * @todo dataStep.nextStep()
     */
    res.send(200);
  }
  else if (req.body.signal === 'job_complete'){
    res.send(200);
  }
};

