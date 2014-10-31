'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users');
	var jobs = require('../../../app/controllers/crowdflower/jobs');

	// Jobs Routes
	app.route('/api/jobs')
		.get(jobs.list)
		.post(users.requiresLogin, jobs.create);

	app.route('/api/jobs/:jobId')
		.get(jobs.read)
		.put(users.requiresLogin, jobs.hasAuthorization, jobs.update)
		.delete(users.requiresLogin, jobs.hasAuthorization, jobs.delete);


	// Finish by binding the Job middleware
	app.param('jobId', jobs.jobByID);
};