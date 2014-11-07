'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Jobtemplate Schema
 *
 * This schema is a collection of settings and template information for a Job.
 * It also describes the type of data that jobs of this template perform work on.
 */
var JobtemplateSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Jobtemplate name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
  model: String,
  fields: [String],
  data: {
    alias: String,

    confidence_fields:[],

    // Job Design
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

    // Gathering Results
    webhook_uri: String
  }
});

JobtemplateSchema.methods.createJob = function (apiKey, callback) {
  var Job = mongoose.model('Job');

  var data = this.data;

  var job = new Job({
    name: this.name + " Instance",
    apiKey: apiKey,
    template: this._id
  });

  job.crowdflower = data;

  job.save(callback);
};

mongoose.model('Jobtemplate', JobtemplateSchema);