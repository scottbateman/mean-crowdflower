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
    id: String,
    title: String,
    alias: String,

    // Job Instructions
    cml: String,
    css: String,
    js: String,
    instructions: String,

    units_per_assignment: Number,
    gold_per_assignment: Number,
    pages_per_assignment: Number,


    judgments_per_unit: Number,
    max_judgments_per_worker: Number,
    max_judgments_per_unit: Number,
    max_judgments_per_ip: Number,
    minimum_account_age_seconds: Number,
    min_unit_confidence: Number,
    units_remain_finalized: Boolean,

    webhook_uri: String,
    send_judgments_webhook: String,

    payment_cents: Number,

    require_worker_login: Boolean,
    minimum_requirements: {
      priority: Number,
      min_score: Number
    },

    options: {
      logical_aggregation: Boolean,
      after_gold: String,
      reject_at: String,
      hide_correct_answers: false,
      calibrated_unit_time: Number
    }
  }
});

JobtemplateSchema.methods.createJob = function (apiKey, callback) {
  var Job = mongoose.model('Job');

  var data = this.data;
  data.title = this.name;


  var job = new Job({
    name: 'Un-named',
    apiKey: apiKey,
    template: this._id
  });

  job.crowdflower = data;

  job.save(callback);
};

mongoose.model('Jobtemplate', JobtemplateSchema);