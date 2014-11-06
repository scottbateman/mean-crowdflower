'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose');

/**
 * Crowdflower Webhook.
 *
 */

exports.webhooks = function (req, res) {
  /**
   * Crowdflower may POST to our servers if a Unit has received all of it's
   * judgments, or if a job has finished.
   */
  if(req.body.signal === 'unit_complete'){
    var Datastep = mongoose.model('Datastep');

    /**
     * payload
     * @type Object
     * For some reason the payload doesn't get parsed by our middleware.
     */
    var payload = JSON.parse(req.body.payload);

    /**
     * id
     * @type String
     * The ID of the Data object that is being processed.
     */
    var id = payload.data._id;

    /**
     * wf_id
     * @type String
     * The ID of the Workflow that is processing this data.
     */
    var wf_id = payload.data._wf_id;

    /**
     * stepIndex
     * @type Number
     * The step in the Workflow that just processed this data.
     */
    var stepIndex = payload.data._s_id;

    /**
     * Find the DataStep linking the Data object to the Workflow.
     */
    Datastep.findOne({workflow: wf_id, data: id})
      .exec(function (err, ds) {
        var status = 200;

        if (err) {
          status = 500;
          console.error(err);
        }


        else if(ds){
          /**
           * A copy of the Data object is sent back to us.
           * Remove it from the payload.
           */
          delete payload.data;

          /**
           * Update the results for this step with the new results.
           * @todo This is overwriting existing results, we want to append them, could we do some kind of deep merge?
           */
          ds.results[stepIndex] = payload;
          ds.nextStep();

        }

        else {
          status = 500;
          console.log("Not on our server's bud.");
        }
        res.end();
      });
  }
  else if (req.body.signal === 'job_complete'){
    res.status(200).end()
  }
};

