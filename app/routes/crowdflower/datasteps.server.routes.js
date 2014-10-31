'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users');
	var datasteps = require('../../../app/controllers/crowdflower/datasteps');

	// Datasteps Routes
	app.route('/api/datasteps')
		.get(datasteps.list)
		.post(users.requiresLogin, datasteps.create);

	app.route('/api/datasteps/:datastepId')
		.get(datasteps.read)
		.put(users.requiresLogin, datasteps.hasAuthorization, datasteps.update)
		.delete(users.requiresLogin, datasteps.hasAuthorization, datasteps.delete);

	// Finish by binding the Datastep middleware
	app.param('datastepId', datasteps.datastepByID);
};