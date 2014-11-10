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
  template: {
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
    gold_per_assignment: {type: Number, default: 1},
    options: {
      front_load: { type: Boolean, default: true},
      after_gold: { type: String, default: "10"},
      //What is the minimum percentage?
      reject_at: { type: String, default: "70"},
      hide_correct_answers: { type: Boolean, default: true}
    },

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

    confidence_fields: [String],

    //// Gathering Results
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