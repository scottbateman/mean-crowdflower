'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
  Job = mongoose.model('Job');

/**
 * Unit Schema
 */
var UnitSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
  job: {
    type: Schema.ObjectId,
    ref: 'Job'
  },
  data: {
    type: Schema.ObjectId
  }
  //crowdflower: {}/** @todo Fill with info from other places. */
	//user: {
	//	type: Schema.ObjectId,
	//	ref: 'User'
	//}
});

UnitSchema.methods.crowdflower = function (apiKey) {
  var id = this.id;
  Job.findById(this.job, function (job) {
    return job.crowdflower(apiKey).then(
      function (job) {
        return job.fetchUnit(id);
      });
  });
};

mongoose.model('Unit', UnitSchema);