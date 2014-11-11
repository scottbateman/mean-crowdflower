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

TweetSchema.methods.pushToWorkflow = function (wf_id) {
  var Datastep = mongoose.model('Datastep');
  var t_id = this._id;
  
  Datastep.find({data: t_id, workflow: wf_id})
    .exec(function (err, ds) {
      if (err) { console.error(err); }
      else if (ds.length !== 0){
        console.error(new Error('This tweet is already in this workflow'));
      }
      else{
        ds = new Datastep({
          workflow: wf_id,
          data: t_id,
          units: [],
          currentStep: null,
          finished: false
        });
        ds.save();
        ds.nextStep();
      }
    });
};

mongoose.model('Tweet', TweetSchema);