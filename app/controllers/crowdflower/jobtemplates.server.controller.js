'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors'),
	Jobtemplate = mongoose.model('Jobtemplate'),
	_ = require('lodash');

/**
 * Create a Jobtemplate
 */
exports.create = function(req, res) {
	var jobtemplate = new Jobtemplate(req.body);

	jobtemplate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(jobtemplate);
		}
	});
};

/**
 * Show the current Jobtemplate
 */
exports.read = function(req, res) {
	res.jsonp(req.jobtemplate);
};

/**
 * Update a Jobtemplate
 */
exports.update = function(req, res) {
	var jobtemplate = req.jobtemplate ;

	jobtemplate = _.extend(jobtemplate , req.body);

	jobtemplate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(jobtemplate);
		}
	});
};

/**
 * Delete an Jobtemplate
 */
exports.delete = function(req, res) {
	var jobtemplate = req.jobtemplate ;

	jobtemplate.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(jobtemplate);
		}
	});
};

/**
 * List of Jobtemplates
 */
exports.list = function(req, res) { Jobtemplate.find().sort('-created').populate('user', 'displayName').exec(function(err, jobtemplates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(jobtemplates);
		}
	});
};

exports.jobs = function (req, res) {
  /** @todo */
  res.send('jobs');
};

exports.createJob = function (req, res) {
  /** @todo */
  res.send('jobs');
};

exports.gold = function (req, res) {
  /**
   * @todo
   */
  res.send('gold');
};

/**
 * Jobtemplate middleware
 */
exports.jobtemplateByID = function(req, res, next, id) { Jobtemplate.findById(id).populate('user', 'displayName').exec(function(err, jobtemplate) {
		if (err) return next(err);
		if (! jobtemplate) return next(new Error('Failed to load Jobtemplate ' + id));
		req.jobtemplate = jobtemplate ;
		next();
	});
};

/**
 * Jobtemplate authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.jobtemplate.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};