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
  template: {
    type: Schema.ObjectId,
    ref: 'Jobtemplate'
  },
  settings:{
    js: String,
    css: String,
    cml: String,
    title: String
  }
});

JobSchema.methods.crowdflower = function (apiKey) {
  var Crowdflower = require('nodejs-crowdflower');
  var cf = new Crowdflower(apiKey);
  return cf.fetchJob(this.crowdflower.id);
};

JobSchema.methods.uploadDataString = function (string, apiKey, callback) {
  callback(null, "Hello");
};

JobSchema.methods.crowdflowerUpload = function (apiKey) {
  return this.crowdflower()
    .then(function (job) {
      return job.update();
    })
};

mongoose.model('Job', JobSchema);