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
  template: {
    css: String,
    js: String,
    cml: String,
    instructions: String,
    title: String
  },
  settings: {
    /** @todo fill out settings info. */
  }
});

JobtemplateSchema.methods.createJob = function (callback) {
  var Job = mongoose.model('Job');
  var job = new Job({
    template: this._id,
    crowdflower: this.template
  });

  job.save(function (job) {
    job.crowdflowerUpdate()
      .then(callback);
  });
};

mongoose.model('Jobtemplate', JobtemplateSchema);