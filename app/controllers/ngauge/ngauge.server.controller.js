'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Workflow = mongoose.model('Workflow'),
    _ = require('lodash');

exports.ngaugePost = function(req, res) {
  var Tweet = mongoose.model('Tweet');
  var tweets = req.body;

  // Make sure it's in an array.
  if (!(tweets instanceof Array)){
    tweets = [tweets];
  }

  // Create Tweets.
  for (var i=0; i<tweets.length; i++){
    tweets[i] = new Tweet(tweets[i]);
    tweets[i].save();
  }

  // Find all active Workflows that work on Tweets.
  Workflow.find({active: true, model: 'Tweet'})
    .exec(function (err, workflows) {
      /** @todo A whole bunch of error checking. */

      // For each workflow found.
      for(var i = 0; i < workflows.length; i++){

        // Push each tweet into the workflow.
        for (var j=0; j < tweets.length; j++){
          tweets[i].pushToWorkflow(workflows[i]._id);
        }
      }
    });

  res.status(200).jsonp({message: 'Upload complete.'});
};

exports.ngaugeGet = function (req, res) {

};


