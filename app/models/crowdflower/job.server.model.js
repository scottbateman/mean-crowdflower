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
    max_judgments_per_worker: { type: Number, default: null},
    max_judgments_per_ip: { type: Number, default: null},
    //minimum_requirements: {
      //min_score: Number,
      //skill_scores: {
        // Only ever 1.
        //level_1_contributors: { type:Number, default:,
        //level_2_contributors: Number,
        //level_3_contributors: Number,
        //unapproved_crowd: Number
      //}
    //},
    //
    included_countries:[ { name: String, code: String } ],
    excluded_countries:[ { name: String, code: String } ],

    // Assignment/Task Settings
    units_per_assignment: {type: Number, default: 10},
    pages_per_assignment: {type: Number, default: 1},

    // Test Questions
    //gold_per_assignment: {type: Number, default: 1},
    //options: {
    //  after_gold: { type: String, default: "10"},
    //  What is the minimum percentage?
      //reject_at: { type: String, default: "70"},
      //hide_correct_answers: { type: Boolean, default: true}
    //},

    // Judgments
    payment_cents: { type: Number, default: 1 },
    judgments_per_unit: { type: Number, default: 2}, // Int
    variable_judgments_mode: {
    //  none, external, auto_confidence
      type: String,
      default: 'auto_confidence'
    },
    expected_judgments_per_unit: { type: Number, default: 2}, // Int
    max_judgments_per_unit: { type: Number, default: 4}, // Int

    min_unit_confidence: { type: Number, default: 0.75}, // between 0 and 1

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
    return cf.fetchJob(this.crowdflower.id)
      .then(syncJobs);
  }
  else{
    var jobData = this.toObject().crowdflower;
    return cf.createJob(jobData).then(syncJobs);
  }

  function syncJobs(job){
    JOB.crowdflower = job;
    JOB.save();
    return job;
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