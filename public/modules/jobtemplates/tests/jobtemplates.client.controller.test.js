'use strict';

(function() {
	// Jobtemplates Controller Spec
	describe('Jobtemplates Controller Tests', function() {
		// Initialize global variables
		var JobtemplatesController,
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

			// Initialize the Jobtemplates controller.
			JobtemplatesController = $controller('JobtemplatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Jobtemplate object fetched from XHR', inject(function(Jobtemplates) {
			// Create sample Jobtemplate using the Jobtemplates service
			var sampleJobtemplate = new Jobtemplates({
				name: 'New Jobtemplate'
			});

			// Create a sample Jobtemplates array that includes the new Jobtemplate
			var sampleJobtemplates = [sampleJobtemplate];

			// Set GET response
			$httpBackend.expectGET('jobtemplates').respond(sampleJobtemplates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.jobtemplates).toEqualData(sampleJobtemplates);
		}));

		it('$scope.findOne() should create an array with one Jobtemplate object fetched from XHR using a jobtemplateId URL parameter', inject(function(Jobtemplates) {
			// Define a sample Jobtemplate object
			var sampleJobtemplate = new Jobtemplates({
				name: 'New Jobtemplate'
			});

			// Set the URL parameter
			$stateParams.jobtemplateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/jobtemplates\/([0-9a-fA-F]{24})$/).respond(sampleJobtemplate);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.jobtemplate).toEqualData(sampleJobtemplate);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Jobtemplates) {
			// Create a sample Jobtemplate object
			var sampleJobtemplatePostData = new Jobtemplates({
				name: 'New Jobtemplate'
			});

			// Create a sample Jobtemplate response
			var sampleJobtemplateResponse = new Jobtemplates({
				_id: '525cf20451979dea2c000001',
				name: 'New Jobtemplate'
			});

			// Fixture mock form input values
			scope.name = 'New Jobtemplate';

			// Set POST response
			$httpBackend.expectPOST('jobtemplates', sampleJobtemplatePostData).respond(sampleJobtemplateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Jobtemplate was created
			expect($location.path()).toBe('/jobtemplates/' + sampleJobtemplateResponse._id);
		}));

		it('$scope.update() should update a valid Jobtemplate', inject(function(Jobtemplates) {
			// Define a sample Jobtemplate put data
			var sampleJobtemplatePutData = new Jobtemplates({
				_id: '525cf20451979dea2c000001',
				name: 'New Jobtemplate'
			});

			// Mock Jobtemplate in scope
			scope.jobtemplate = sampleJobtemplatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/jobtemplates\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/jobtemplates/' + sampleJobtemplatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid jobtemplateId and remove the Jobtemplate from the scope', inject(function(Jobtemplates) {
			// Create new Jobtemplate object
			var sampleJobtemplate = new Jobtemplates({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Jobtemplates array and include the Jobtemplate
			scope.jobtemplates = [sampleJobtemplate];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/jobtemplates\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleJobtemplate);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.jobtemplates.length).toBe(0);
		}));
	});
}());