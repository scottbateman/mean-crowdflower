'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users');
	var judgments = require('../../../app/controllers/crowdflower/judgments');

	// Judgments Routes
	app.route('/api/judgments')
		.get(judgments.list)
		.post(users.requiresLogin, judgments.create);

	app.route('/api/judgments/:judgmentId')
		.get(judgments.read)
		.put(users.requiresLogin, judgments.hasAuthorization, judgments.update)
		.delete(users.requiresLogin, judgments.hasAuthorization, judgments.delete);

	// Finish by binding the Judgment middleware
	app.param('judgmentId', judgments.judgmentByID);
};