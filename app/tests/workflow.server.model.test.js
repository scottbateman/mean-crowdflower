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

var data = {
  "_id" : { "$oid" : "54199044e4b15e5922098ae9" },
  "score" : null,
  "coordinates" : "40.011444, -75.194806",
  "created_at" : { "$date" : 1410961473000 },
  "id" : "512235660494008320",
  "text" : "@Thereeselife I'm chillen workin, saving up to get my own house soon. Hbu how you been ?",
  "state" : 2,
  "user" : {
    "friends_count" : 2025,
    "realLocation" : {
      "country" : "US",
      "city" : "",
      "name" : "US [39.78373, -100.445882]",
      "lon" : -100.445882,
      "state" : "",
      "lat" : 39.78373 },
    "image" : "http://pbs.twimg.com/profile_images/511023020488794112/c39eikM3_bigger.jpeg",
    "verified" : false,
    "description" : "Muslim First ☝️. #FreeSpitty #FreeShizz #RIPTrey #RIPSnacks",
    "time_zone" : "Atlantic Time (Canada)",
    "locationConfirmed" : true,
    "url" : null,
    "profiling" : {},
    "screen_name" : "KushBeats215",
    "followers_count" : 4056,
    "name" : "IG: @KushBeats_",
    "location" : "Uptown✈️South Philly",
    "id" : "2167142502",
    "geo_enabled" : true,
    "lang" : "en"
  },
  "isRetweet" : false
};

/**
 * Unit tests
 */
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
      jobtemplate = new Jobtemplate({
        name: 'Jobtemplate Name',
        model: 'Tweet',
        fields: ['advertisement', 'genuine'],
        data: {
          title: 'Job Title',
          alias: 'Job Alias',
          cml: '<h1>Job CML</h1>',
        }
      });
    });

    // Workflow
		user.save(function() { 
			workflow = new Workflow({
				name: 'Workflow Name',
				user: user,
        apiKey: '',
        active: true,
        model: 'Tweet',
        steps: [
          {
            template: jobtemplate,
            queue: [],
            queueLimit: 1,
            requirements: [
              {
                field: 'advertisement',
                confidence: '80'
              },
              {
                field: 'genuine',
                confidence: '80'
              }
            ],
            nextPass: -1,
            nextFail: -1
          }
        ]
			});

			done();
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