'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Judgment Schema
 */
var JudgmentSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
  unit: {
    type: Schema.ObjectId,
    ref: 'Unit'
  },
  crowdflower: Object /** @todo Fill this out */
	//user: {
	//	type: Schema.ObjectId,
	//	ref: 'User'
	//}
});

mongoose.model('Judgment', JudgmentSchema);