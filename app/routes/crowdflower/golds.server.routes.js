'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users');
	var golds = require('../../../app/controllers/crowdflower/golds');

	// Golds Routes
	app.route('/api/golds')
		.get(golds.list)
		.post(users.requiresLogin, golds.create);

	app.route('/api/golds/:goldId')
		.get(golds.read)
		.put(users.requiresLogin, golds.hasAuthorization, golds.update)
		.delete(users.requiresLogin, golds.hasAuthorization, golds.delete);

	// Finish by binding the Gold middleware
	app.param('goldId', golds.goldByID);
};