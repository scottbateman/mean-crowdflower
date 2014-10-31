'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Jobtemplate = mongoose.model('Jobtemplate');

/**
 * Globals
 */
var user, jobtemplate;

/**
 * Unit tests
 */
describe('Jobtemplate Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			jobtemplate = new Jobtemplate({
				name: 'Jobtemplate Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return jobtemplate.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			jobtemplate.name = '';

			return jobtemplate.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Jobtemplate.remove().exec();
		User.remove().exec();

		done();
	});
});