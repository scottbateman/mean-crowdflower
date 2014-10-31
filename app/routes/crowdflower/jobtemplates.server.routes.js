'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users');
	var jobtemplates = require('../../../app/controllers/crowdflower/jobtemplates');

	// Jobtemplates Routes
	app.route('/api/jobtemplates')
		.get(jobtemplates.list)
		.post(jobtemplates.create);

	app.route('/api/jobtemplates/:jobtemplateId')
		.get(jobtemplates.read)
		.put(jobtemplates.update)
		.delete(jobtemplates.delete);

  app.route('/api/jobtemplates/:jobtemplateId/jobs')
    .get(jobtemplates.jobs)
    .post(jobtemplates.createJob);

  app.route('/api/jobtemplates/:jobtemplateId/:jobId')
    .get(function (req, res) {
      res.redirect('/api/jobs/' + req.jobId);
    });

  app.route('/api/jobtemplates/:jobtemplateId/gold')
    .get(jobtemplates.gold);

	// Finish by binding the Jobtemplate middleware
	app.param('jobtemplateId', jobtemplates.jobtemplateByID);
};