'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users');
	var tweets = require('../../../app/controllers/ngauge/tweets');

	// List and Create
	app.route('/api/tweets')
		.get(tweets.list)
		.post(tweets.create); //users.requiresLogin, tweets.create);

  // Get, Update, Delete
	app.route('/api/tweets/:tweetId')
		.get(tweets.read)
		.put(users.requiresLogin, tweets.hasAuthorization, tweets.update)
		.delete(users.requiresLogin, tweets.hasAuthorization, tweets.delete);

  // List jobs
  app.route('/api/tweets/:tweetId/jobs')
    .get(tweets.jobs);

  // Access a job
  app.route('/api/tweets/:tweetId/jobs/:jobId')
    .get(function (req, res) {
      res.redirect('/api/jobs/' + req.jobId);
    });

  // List create units from many jobs.
  app.route('/api/tweets/:tweetId/jobs/units')
    .get(tweets.allUnits)
    .post(tweets.createUnits);

  // List or create units form one job
  app.route('/api/tweets/:tweetId/jobs/:jobId/units')
    .get(tweets.jobUnits)
    .post(tweets.createJobUnits);

  // Access a unit.
  app.route('/api/tweets/:tweetId/jobs/:jobId/units/:unitId')
    .all(function (req, res) {
      res.redirect('/api/jobs'+req.jobId+'/units/'+req.unitId);
    });

  // Get and Create gold
  app.route('/api/tweets/:tweetId/gold')
    .get(tweets.gold)
    .post(tweets.createGold);

	// Finish by binding the Tweet middleware
	app.param('tweetId', tweets.tweetByID);
};