'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors'),
	Gold = mongoose.model('Gold'),
	_ = require('lodash');

/**
 * Create a Gold
 */
exports.create = function(req, res) {
	var gold = new Gold(req.body);
	gold.user = req.user;

	gold.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gold);
		}
	});
};

/**
 * Show the current Gold
 */
exports.read = function(req, res) {
	res.jsonp(req.gold);
};

/**
 * Update a Gold
 */
exports.update = function(req, res) {
	var gold = req.gold ;

	gold = _.extend(gold , req.body);

	gold.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gold);
		}
	});
};

/**
 * Delete an Gold
 */
exports.delete = function(req, res) {
	var gold = req.gold ;

	gold.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gold);
		}
	});
};

/**
 * List of Golds
 */
exports.list = function(req, res) { Gold.find().sort('-created').populate('user', 'displayName').exec(function(err, golds) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(golds);
		}
	});
};

/**
 * Gold middleware
 */
exports.goldByID = function(req, res, next, id) { Gold.findById(id).populate('user', 'displayName').exec(function(err, gold) {
		if (err) return next(err);
		if (! gold) return next(new Error('Failed to load Gold ' + id));
		req.gold = gold ;
		next();
	});
};

/**
 * Gold authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.gold.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};