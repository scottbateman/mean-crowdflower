'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users');
	var units = require('../../../app/controllers/crowdflower/units');

	// Units Routes
	app.route('/api/units')
		.get(units.list)
		.post(users.requiresLogin, units.create);

	app.route('/api/units/:unitId')
		.get(units.read)
		.put(users.requiresLogin, units.hasAuthorization, units.update)
		.delete(users.requiresLogin, units.hasAuthorization, units.delete);

	// Finish by binding the Unit middleware
	app.param('unitId', units.unitByID);
};