'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Workflow = mongoose.model('Workflow'),
    _ = require('lodash');

exports.ngaugePost = function(req, res) {
  // I think this process is fairly well defined start to finish.
  /** @todo Make sure this is for real. */
  var tweets = req.body;

  /** @todo replace with an actual id. */
  var wfid = 1;

  Workflow.findById(wfid)
    .exec(function (wf) {
      /** @todo Do some checks to make sure the Workflow is found. */
      wf.ingestData(tweets);

      /** @todo What should be returned? */
      res.json({message: 'STUB'});
    });
};


