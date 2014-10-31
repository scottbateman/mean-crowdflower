'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors'),
	Datastep = mongoose.model('Datastep'),
	_ = require('lodash');

/**
 * Create a Datastep
 */
exports.create = function(req, res) {
	var datastep = new Datastep(req.body);
	datastep.user = req.user;

	datastep.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(datastep);
		}
	});
};

/**
 * Show the current Datastep
 */
exports.read = function(req, res) {
	res.jsonp(req.datastep);
};

/**
 * Update a Datastep
 */
exports.update = function(req, res) {
	var datastep = req.datastep ;

	datastep = _.extend(datastep , req.body);

	datastep.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(datastep);
		}
	});
};

/**
 * Delete an Datastep
 */
exports.delete = function(req, res) {
	var datastep = req.datastep ;

	datastep.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(datastep);
		}
	});
};

/**
 * List of Datasteps
 */
exports.list = function(req, res) { Datastep.find().sort('-created').populate('user', 'displayName').exec(function(err, datasteps) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(datasteps);
		}
	});
};

/**
 * Datastep middleware
 */
exports.datastepByID = function(req, res, next, id) { Datastep.findById(id).populate('user', 'displayName').exec(function(err, datastep) {
		if (err) return next(err);
		if (! datastep) return next(new Error('Failed to load Datastep ' + id));
		req.datastep = datastep ;
		next();
	});
};

/**
 * Datastep authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.datastep.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};