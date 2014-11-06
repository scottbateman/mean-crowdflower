'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors'),
	Workflow = mongoose.model('Workflow'),
	_ = require('lodash');

/**
 * Create a Workflow
 */
exports.create = function(req, res) {
	var workflow = new Workflow(req.body);
	workflow.user = req.user;

	workflow.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workflow);
		}
	});
};

/**
 * Show the current Workflow
 */
exports.read = function(req, res) {
	res.jsonp(req.workflow);
};

/**
 * Update a Workflow
 */
exports.update = function(req, res) {
	var workflow = req.workflow ;

	workflow = _.extend(workflow , req.body);

	workflow.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workflow);
		}
	});
};

/**
 * Delete an Workflow
 */
exports.delete = function(req, res) {
	var workflow = req.workflow ;

	workflow.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workflow);
		}
	});
};

/**
 * List of Workflows
 */
exports.list = function(req, res) { Workflow.find('-apiKey').sort('-created').populate('user', 'displayName').exec(function(err, workflows) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workflows);
		}
	});
};

/**
 * Workflow middleware
 */
exports.workflowByID = function(req, res, next, id) { Workflow.findById(id, '-apiKey').populate('user', 'displayName').exec(function(err, workflow) {
		if (err) return next(err);
		if (! workflow) return next(new Error('Failed to load Workflow ' + id));
		req.workflow = workflow ;
		next();
	});
};

/**
 * Workflow authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.workflow.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


exports.ingestData = function (req, res, next) {
  //GOOD
  req.workflow.ingestData(req.body, function (err, data) {
    res.jsonp({data: data});
  });
};


exports.uploadStep = function (req, res, next) {
  var apiKey = '111';
  req.workflow.uploadStepQueue(req.params.stepIndex, apiKey, function (err, message) {
    res.jsonp({message: message});
  });
};