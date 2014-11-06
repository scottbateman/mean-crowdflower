'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Job Schema
 */
var JobSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Job name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
  /** @todo this is probably bad. */
  apiKey: String,
  template: {
    type: Schema.ObjectId,
    ref: 'Jobtemplate'
  },
  crowdflower: {
    id: String,
    title: String,
    alias: String,

    // Job Instructions
    cml: String,
    css: String,
    js: String,
    instructions: String,

    max_judgments_per_worker: Number,

    options: {
      logical_aggregation: Boolean,
      after_gold: String,
      reject_at: String,
      hide_correct_answers: false,
    }

  }
});

/**
 * connect
 *
 * @returns {*}
 * Promises a Crowdflower representation of the job.
 */
JobSchema.methods.connect = function () {
  var Crowdflower = require('nodejs-crowdflower');
  var cf = new Crowdflower(this.apiKey);
  var JOB = this;

  if (this.crowdflower.id) {
    return cf.fetchJob(this.crowdflower.id);
  }
  else{
    var jobData = this.toObject().crowdflower;
    return cf.createJob(jobData).then(
      function (job) {
        JOB.crowdflower.id = job.id;
        JOB.save();
        return job;
      }
    );
  }
};

JobSchema.methods.uploadString = function (string, callback) {
  this.connect()
    .then(
      // If connects
      function (job) {
        return job.uploadString(string);
      })
    .then(
      // If uploads
      function (job) {
        console.log("String upload complete.");
        callback(null, {message: 'Data uploaded successfully'});
      },
      // else
      function (err) {
        console.error(err);
        callback(err);
      });
};

mongoose.model('Job', JobSchema);