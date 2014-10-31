'use strict';

(function() {
	// Workers Controller Spec
	describe('Workers Controller Tests', function() {
		// Initialize global variables
		var WorkersController,
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

			// Initialize the Workers controller.
			WorkersController = $controller('WorkersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Worker object fetched from XHR', inject(function(Workers) {
			// Create sample Worker using the Workers service
			var sampleWorker = new Workers({
				name: 'New Worker'
			});

			// Create a sample Workers array that includes the new Worker
			var sampleWorkers = [sampleWorker];

			// Set GET response
			$httpBackend.expectGET('workers').respond(sampleWorkers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.workers).toEqualData(sampleWorkers);
		}));

		it('$scope.findOne() should create an array with one Worker object fetched from XHR using a workerId URL parameter', inject(function(Workers) {
			// Define a sample Worker object
			var sampleWorker = new Workers({
				name: 'New Worker'
			});

			// Set the URL parameter
			$stateParams.workerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/workers\/([0-9a-fA-F]{24})$/).respond(sampleWorker);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.worker).toEqualData(sampleWorker);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Workers) {
			// Create a sample Worker object
			var sampleWorkerPostData = new Workers({
				name: 'New Worker'
			});

			// Create a sample Worker response
			var sampleWorkerResponse = new Workers({
				_id: '525cf20451979dea2c000001',
				name: 'New Worker'
			});

			// Fixture mock form input values
			scope.name = 'New Worker';

			// Set POST response
			$httpBackend.expectPOST('workers', sampleWorkerPostData).respond(sampleWorkerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Worker was created
			expect($location.path()).toBe('/workers/' + sampleWorkerResponse._id);
		}));

		it('$scope.update() should update a valid Worker', inject(function(Workers) {
			// Define a sample Worker put data
			var sampleWorkerPutData = new Workers({
				_id: '525cf20451979dea2c000001',
				name: 'New Worker'
			});

			// Mock Worker in scope
			scope.worker = sampleWorkerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/workers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/workers/' + sampleWorkerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid workerId and remove the Worker from the scope', inject(function(Workers) {
			// Create new Worker object
			var sampleWorker = new Workers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Workers array and include the Worker
			scope.workers = [sampleWorker];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/workers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWorker);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.workers.length).toBe(0);
		}));
	});
}());