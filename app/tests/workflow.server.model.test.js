'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Workflow = mongoose.model('Workflow'),
  Jobtemplate = mongoose.model('Jobtemplate');

/**
 * Globals
 */
var user, workflow, jobtemplate;

describe('Workflow Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

    // Job template
    user.save(function () {
      jobtemplate = new Jobtemplate({ });
    });

    // Workflow
		user.save(function() {
      workflow = new Workflow({});
    });
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return workflow.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			workflow.name = '';

			return workflow.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Workflow.remove().exec();
    Jobtemplate.remove().exec();
		User.remove().exec();

		done();
	});
});