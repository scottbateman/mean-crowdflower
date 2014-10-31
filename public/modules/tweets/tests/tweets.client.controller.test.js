'use strict';

(function() {
	// Tweets Controller Spec
	describe('Tweets Controller Tests', function() {
		// Initialize global variables
		var TweetsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Tweets controller.
			TweetsController = $controller('TweetsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tweet object fetched from XHR', inject(function(Tweets) {
			// Create sample Tweet using the Tweets service
			var sampleTweet = new Tweets({
				name: 'New Tweet'
			});

			// Create a sample Tweets array that includes the new Tweet
			var sampleTweets = [sampleTweet];

			// Set GET response
			$httpBackend.expectGET('tweets').respond(sampleTweets);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tweets).toEqualData(sampleTweets);
		}));

		it('$scope.findOne() should create an array with one Tweet object fetched from XHR using a tweetId URL parameter', inject(function(Tweets) {
			// Define a sample Tweet object
			var sampleTweet = new Tweets({
				name: 'New Tweet'
			});

			// Set the URL parameter
			$stateParams.tweetId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tweets\/([0-9a-fA-F]{24})$/).respond(sampleTweet);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tweet).toEqualData(sampleTweet);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tweets) {
			// Create a sample Tweet object
			var sampleTweetPostData = new Tweets({
				name: 'New Tweet'
			});

			// Create a sample Tweet response
			var sampleTweetResponse = new Tweets({
				_id: '525cf20451979dea2c000001',
				name: 'New Tweet'
			});

			// Fixture mock form input values
			scope.name = 'New Tweet';

			// Set POST response
			$httpBackend.expectPOST('tweets', sampleTweetPostData).respond(sampleTweetResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tweet was created
			expect($location.path()).toBe('/tweets/' + sampleTweetResponse._id);
		}));

		it('$scope.update() should update a valid Tweet', inject(function(Tweets) {
			// Define a sample Tweet put data
			var sampleTweetPutData = new Tweets({
				_id: '525cf20451979dea2c000001',
				name: 'New Tweet'
			});

			// Mock Tweet in scope
			scope.tweet = sampleTweetPutData;

			// Set PUT response
			$httpBackend.expectPUT(/tweets\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tweets/' + sampleTweetPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tweetId and remove the Tweet from the scope', inject(function(Tweets) {
			// Create new Tweet object
			var sampleTweet = new Tweets({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tweets array and include the Tweet
			scope.tweets = [sampleTweet];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tweets\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTweet);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tweets.length).toBe(0);
		}));
	});
}());