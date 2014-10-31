'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users');
	var workflows = require('../../../app/controllers/crowdflower/workflows');

	// Workflows Routes
	app.route('/api/workflows')
		.get(workflows.list)
		.post(workflows.create);

	app.route('/api/workflows/:workflowId')
		.get(workflows.read)
		.put(workflows.update)
		.delete(workflows.delete);

  app.route('/api/workflows/:workflowId/data')
    .post(workflows.ingestData);

  app.route('/api/workflows/:workflowId/steps/:stepIndex/upload')
    .get(workflows.uploadStep);

	// Finish by binding the Workflow middleware
	app.param('workflowId', workflows.workflowByID);
};