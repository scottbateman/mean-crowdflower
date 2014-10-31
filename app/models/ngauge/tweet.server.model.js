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
  jobs: {
    type: Schema.ObjectId,
    ref: 'Job'
  }, // This is an array of job_ids from Crowdflower.
  data: {
    //_id: Schema.Types.ObjectId,
    //score: ???,
    coordinates: String,
    //created_at: Date,
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
  }
});

mongoose.model('Tweet', TweetSchema);