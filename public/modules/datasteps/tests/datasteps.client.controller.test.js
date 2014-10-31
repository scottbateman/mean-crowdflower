'use strict';

(function() {
	// Datasteps Controller Spec
	describe('Datasteps Controller Tests', function() {
		// Initialize global variables
		var DatastepsController,
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

			// Initialize the Datasteps controller.
			DatastepsController = $controller('DatastepsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Datastep object fetched from XHR', inject(function(Datasteps) {
			// Create sample Datastep using the Datasteps service
			var sampleDatastep = new Datasteps({
				name: 'New Datastep'
			});

			// Create a sample Datasteps array that includes the new Datastep
			var sampleDatasteps = [sampleDatastep];

			// Set GET response
			$httpBackend.expectGET('datasteps').respond(sampleDatasteps);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.datasteps).toEqualData(sampleDatasteps);
		}));

		it('$scope.findOne() should create an array with one Datastep object fetched from XHR using a datastepId URL parameter', inject(function(Datasteps) {
			// Define a sample Datastep object
			var sampleDatastep = new Datasteps({
				name: 'New Datastep'
			});

			// Set the URL parameter
			$stateParams.datastepId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/datasteps\/([0-9a-fA-F]{24})$/).respond(sampleDatastep);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.datastep).toEqualData(sampleDatastep);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Datasteps) {
			// Create a sample Datastep object
			var sampleDatastepPostData = new Datasteps({
				name: 'New Datastep'
			});

			// Create a sample Datastep response
			var sampleDatastepResponse = new Datasteps({
				_id: '525cf20451979dea2c000001',
				name: 'New Datastep'
			});

			// Fixture mock form input values
			scope.name = 'New Datastep';

			// Set POST response
			$httpBackend.expectPOST('datasteps', sampleDatastepPostData).respond(sampleDatastepResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Datastep was created
			expect($location.path()).toBe('/datasteps/' + sampleDatastepResponse._id);
		}));

		it('$scope.update() should update a valid Datastep', inject(function(Datasteps) {
			// Define a sample Datastep put data
			var sampleDatastepPutData = new Datasteps({
				_id: '525cf20451979dea2c000001',
				name: 'New Datastep'
			});

			// Mock Datastep in scope
			scope.datastep = sampleDatastepPutData;

			// Set PUT response
			$httpBackend.expectPUT(/datasteps\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/datasteps/' + sampleDatastepPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid datastepId and remove the Datastep from the scope', inject(function(Datasteps) {
			// Create new Datastep object
			var sampleDatastep = new Datasteps({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Datasteps array and include the Datastep
			scope.datasteps = [sampleDatastep];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/datasteps\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDatastep);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.datasteps.length).toBe(0);
		}));
	});
}());