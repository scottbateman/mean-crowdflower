'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Gold Schema
 */
var GoldSchema = new Schema({
	//name: {
	//	type: String,
	//	default: '',
	//	required: 'Please fill Gold name',
	//	trim: true
	//},
	created: {
		type: Date,
		default: Date.now
	},
  template: {
    type: Schema.ObjectId,
    ref: 'Jobtemplate'
  },
  tweet: {
    type: Schema.ObjectId,
    ref: 'Tweet'
  }
  //answers: {}
	//user: {
	//	type: Schema.ObjectId,
	//	ref: 'User'
	//}
});

mongoose.model('Gold', GoldSchema);