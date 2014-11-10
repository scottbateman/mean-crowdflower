'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors'),
	Tweet = mongoose.model('Tweet'),
  Crowdflower = require('nodejs-crowdflower'),
	_ = require('lodash');

/**
 * Create a Tweet
 */
exports.create = function(req, res) {
  var tweets;
  if(req.body instanceof Array){
    tweets = req.body;
  }
  else{
    tweets = [req.body];
  }

  var response = {
    error: [],
    success: []
  };

  function sendResponse(err) {
    if(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else{
      response.success.push({id: this.id});
    }

    if((response.error.length + response.success.length) === tweets.length){
      res.json(response);
    }
  }

  var tweet;
  for (var i=0; i<tweets.length; i++){
    tweet =  new Tweet({
      data: tweets[i],
      jobs: []
    });
    tweet.data.user = tweets[i].user;
    //tweet.data._id = new ObjectId(tweets[i]._id["$oid"]);
    //tweet.data.created_at = new Date(tweets[i].created_at["$date"]);
    tweet.save(sendResponse.bind(tweet));
  }
};

/**
 * Show the current Tweet
 */
exports.read = function(req, res) {
	res.jsonp(req.tweet);
};

/**
 * Update a Tweet
 */
exports.update = function(req, res) {
	var tweet = req.tweet ;

	tweet = _.extend(tweet , req.body);

	tweet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tweet);
		}
	});
};

/**
 * Delete an Tweet
 */
exports.delete = function(req, res) {
	var tweet = req.tweet ;

	tweet.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tweet);
		}
	});
};

/**
 * List of Tweets
 */
exports.list = function(req, res) {
  Tweet.find().sort('-created').exec(
    function(err, tweets) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tweets);
		}
	});
};


exports.jobs = function (req, res) {
  /**
   * @todo
   */
  res.send('jobs');
};

exports.allUnits = function (req, res) {
  /**
   * @todo
   */
  res.send('allUnits');
};

exports.createUnits = function (req, res) {
  /**
   * @todo
   */
  res.send('createUnits');
};

exports.jobUnits = function (req, res) {
  /**
   * @todo
   */
  res.send('jobUnits');
};

exports.createJobUnits = function (req, res) {
  /**
   * @todo
   */
  res.send('createJobUnits');
};


exports.gold = function (req, res) {
  /**
   * @todo
   */
  res.send('gold');
};


exports.createGold= function (req, res) {
  /**
   * @todo
   */
  res.send('jobUnits');
};


/**
 * Tweet middleware
 */
exports.tweetByID = function(req, res, next, id) { Tweet.findById(id).exec(function(err, tweet) {
		if (err) return next(err);
		if (! tweet) return next(new Error('Failed to load Tweet ' + id));
		req.tweet = tweet;
		next();
	});
};

/**
 * Tweet authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tweet.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};