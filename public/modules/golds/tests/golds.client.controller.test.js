'use strict';

(function() {
	// Golds Controller Spec
	describe('Golds Controller Tests', function() {
		// Initialize global variables
		var GoldsController,
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

			// Initialize the Golds controller.
			GoldsController = $controller('GoldsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Gold object fetched from XHR', inject(function(Golds) {
			// Create sample Gold using the Golds service
			var sampleGold = new Golds({
				name: 'New Gold'
			});

			// Create a sample Golds array that includes the new Gold
			var sampleGolds = [sampleGold];

			// Set GET response
			$httpBackend.expectGET('golds').respond(sampleGolds);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.golds).toEqualData(sampleGolds);
		}));

		it('$scope.findOne() should create an array with one Gold object fetched from XHR using a goldId URL parameter', inject(function(Golds) {
			// Define a sample Gold object
			var sampleGold = new Golds({
				name: 'New Gold'
			});

			// Set the URL parameter
			$stateParams.goldId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/golds\/([0-9a-fA-F]{24})$/).respond(sampleGold);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gold).toEqualData(sampleGold);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Golds) {
			// Create a sample Gold object
			var sampleGoldPostData = new Golds({
				name: 'New Gold'
			});

			// Create a sample Gold response
			var sampleGoldResponse = new Golds({
				_id: '525cf20451979dea2c000001',
				name: 'New Gold'
			});

			// Fixture mock form input values
			scope.name = 'New Gold';

			// Set POST response
			$httpBackend.expectPOST('golds', sampleGoldPostData).respond(sampleGoldResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Gold was created
			expect($location.path()).toBe('/golds/' + sampleGoldResponse._id);
		}));

		it('$scope.update() should update a valid Gold', inject(function(Golds) {
			// Define a sample Gold put data
			var sampleGoldPutData = new Golds({
				_id: '525cf20451979dea2c000001',
				name: 'New Gold'
			});

			// Mock Gold in scope
			scope.gold = sampleGoldPutData;

			// Set PUT response
			$httpBackend.expectPUT(/golds\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/golds/' + sampleGoldPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid goldId and remove the Gold from the scope', inject(function(Golds) {
			// Create new Gold object
			var sampleGold = new Golds({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Golds array and include the Gold
			scope.golds = [sampleGold];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/golds\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGold);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.golds.length).toBe(0);
		}));
	});
}());