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
    max_judgments_per_worker: { type: Number },
    max_judgments_per_ip: { type: Number },
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
    options: {
      front_load: { type: Boolean, default: false},
      after_gold: { type: String, default: "10"},

      //What is the minimum percentageo? This can't be an empty string.
      reject_at: { type: String, default: "50" },
      hide_correct_answers: { type: Boolean, default: false}
    },

    // This must be set to 0 if there are no test questions.
    gold_per_assignment: {type: Number, default: 0},

    // Payment
    payment_cents: { type: Number, default: 1 },

    // Non Variable Judgments
    judgments_per_unit: { type: Number, default: 2 }, // Int

    // Variable Judgments
    variable_judgments_mode: {
      // This breaks things.
      type: String,
      default: 'auto_confidence'
    },
    expected_judgments_per_unit: { type: Number }, // Int
    max_judgments_per_unit: { type: Number }, // Int
    min_unit_confidence: { type: Number }, // between 0 and 1

    // Gathering Results
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
    console.log("Jobschema - Fetching Job from Crowdflower");
    return cf.fetchJob(this.crowdflower.id)
      .then(syncJobs, err);
  }
  else{
    console.log("Jobschema - Creating Job on Crowdflower");
    var jobData = JOB.toObject().crowdflower;

    /**
     * For some reason you cannot set this variable when creating the job.
     * Instead, update the job after it's already been created.
     */
    delete jobData.variable_judgments_mode;
    delete jobData.expected_judgments_per_unit;
    delete jobData.max_judgments_per_unit;
    delete jobData.min_unit_confidence;

    /**
     * These variables cannot be set unless there are test questions.
     */
    delete jobData.gold_per_assignment;

    return cf.createJob(jobData)
      .then(function (job) {
        console.log("Jobschema - Job created: ", job.id);
        job.expected_judgments_per_unit = JOB.crowdflower.expected_judgments_per_unit;
        job.max_judgments_per_unit = JOB.crowdflower.max_judgments_per_unit;
        job.min_unit_confidence = JOB.crowdflower.min_unit_confidence;
        job.variable_judgments_mode = JOB.crowdflower.variable_judgments_mode;

        /**
         * @todo Check that there are gold questions available to do.
         */
        //job.gold_per_assignment = JOB.crowdflower.gold_per_assignment;

        return job.update();
      })
      .then(syncJobs, function (err) {
        console.log("Failed to upload other things");
      });
  }

  function syncJobs(job){
    console.log("Jobschema - Job fetched: ", job.id);
    JOB.crowdflower = job;
    JOB.save();
    return job;
  }

  function err(err){
    console.log("Jobschema - Job failed to be created/fetched: ", err);
  }
};

JobSchema.methods.uploadString = function (string, callback) {
  this.connect()
    .then(
      // If connects
      function (job) {
        console.log("Jobschema - Uploading string to Crowdflower");
        return job.uploadString(string);
      })
    .then(
      // If uploads
      function (job) {
        console.log("Jobschema - Uploading string Sucessful");
        callback(null, {message: 'Data uploaded successfully'});
      },
      // else
      function (err) {
        console.log("Jobschema - String upload error:", err);
        callback(err);
      });
};

mongoose.model('Job', JobSchema);