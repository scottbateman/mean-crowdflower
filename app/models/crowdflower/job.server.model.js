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
    //alias: String,

    // Job Instructions
    title: String,
    instructions: String,
    cml: String,
    css: String,
    js: String,

    // Worker Restrictions
    max_judgments_per_worker: Number,
    max_judgments_per_ip: Number,
    minimum_account_age_seconds: Number,
    require_worker_login: Boolean,
    minimum_requirements: {
      min_score: Number,
      skill_scores: {
        // Only ever 1.
        level_1_contributors: Number,
        level_2_contributors: Number,
        level_3_contributors: Number,
        unapproved_crowd: Number
      }
    },
    //
    included_countries:[ { name: String, code: String } ],
    excluded_countries:[ { name: String, code: String } ],

    // Assignment/Task Settings
    units_per_assignment: Number,
    pages_per_assignment: Number,

    // Test Questions
    gold_per_assignment: Number,
    options: {
      after_gold: String,
      // What is the minimum percentage?
      reject_at: String,
      hide_correct_answers: Boolean
    },

    // Judgments
    payment_cents: Number,
    judgments_per_unit: Number, // Int
    expected_judgments_per_unit: Number, // Int
    max_judgments_per_unit: Number, // Int
    variable_judgments_mode: String, // none, external, auto_confidence
    min_unit_confidence: Number, // between 0 and 1
    units_remain_finalized: Boolean,

    //// Gathering Results
    webhook_uri: String
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