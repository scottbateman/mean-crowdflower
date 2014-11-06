'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tweet Schema
 */
var TweetSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
  //_id: Schema.Types.ObjectId,
  coordinates: String,
  id: String,
  text: String,
  state: Number,
  isRetweet: Boolean,
  user: {
    friends_count: Number,
    realLocation: {
      country: String,
      city: String,
      name: String,
      long: Number,
      state: String,
      lat: Number
    },
    image: String,
    verified: Boolean,
    description: String,
    time_zone: String,
    locationConfirmed: Boolean,
    url: String,
    profiling: Object,
    screen_name: String,
    followers_count: Number,
    name: String,
    location: String,
    id: String,
    geo_enabled: Boolean,
    lang: String
  }
});

mongoose.model('Tweet', TweetSchema);