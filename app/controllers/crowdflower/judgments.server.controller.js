'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors'),
	Judgment = mongoose.model('Judgment'),
	_ = require('lodash');

/**
 * Create a Judgment
 */
exports.create = function(req, res) {
	var judgment = new Judgment(req.body);
	judgment.user = req.user;

	judgment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(judgment);
		}
	});
};

/**
 * Show the current Judgment
 */
exports.read = function(req, res) {
	res.jsonp(req.judgment);
};

/**
 * Update a Judgment
 */
exports.update = function(req, res) {
	var judgment = req.judgment ;

	judgment = _.extend(judgment , req.body);

	judgment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(judgment);
		}
	});
};

/**
 * Delete an Judgment
 */
exports.delete = function(req, res) {
	var judgment = req.judgment ;

	judgment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(judgment);
		}
	});
};

/**
 * List of Judgments
 */
exports.list = function(req, res) { Judgment.find().sort('-created').populate('user', 'displayName').exec(function(err, judgments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(judgments);
		}
	});
};

/**
 * Judgment middleware
 */
exports.judgmentByID = function(req, res, next, id) { Judgment.findById(id).populate('user', 'displayName').exec(function(err, judgment) {
		if (err) return next(err);
		if (! judgment) return next(new Error('Failed to load Judgment ' + id));
		req.judgment = judgment ;
		next();
	});
};

/**
 * Judgment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.judgment.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};