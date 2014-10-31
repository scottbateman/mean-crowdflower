'use strict';

(function() {
	// Judgments Controller Spec
	describe('Judgments Controller Tests', function() {
		// Initialize global variables
		var JudgmentsController,
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

			// Initialize the Judgments controller.
			JudgmentsController = $controller('JudgmentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Judgment object fetched from XHR', inject(function(Judgments) {
			// Create sample Judgment using the Judgments service
			var sampleJudgment = new Judgments({
				name: 'New Judgment'
			});

			// Create a sample Judgments array that includes the new Judgment
			var sampleJudgments = [sampleJudgment];

			// Set GET response
			$httpBackend.expectGET('judgments').respond(sampleJudgments);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.judgments).toEqualData(sampleJudgments);
		}));

		it('$scope.findOne() should create an array with one Judgment object fetched from XHR using a judgmentId URL parameter', inject(function(Judgments) {
			// Define a sample Judgment object
			var sampleJudgment = new Judgments({
				name: 'New Judgment'
			});

			// Set the URL parameter
			$stateParams.judgmentId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/judgments\/([0-9a-fA-F]{24})$/).respond(sampleJudgment);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.judgment).toEqualData(sampleJudgment);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Judgments) {
			// Create a sample Judgment object
			var sampleJudgmentPostData = new Judgments({
				name: 'New Judgment'
			});

			// Create a sample Judgment response
			var sampleJudgmentResponse = new Judgments({
				_id: '525cf20451979dea2c000001',
				name: 'New Judgment'
			});

			// Fixture mock form input values
			scope.name = 'New Judgment';

			// Set POST response
			$httpBackend.expectPOST('judgments', sampleJudgmentPostData).respond(sampleJudgmentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Judgment was created
			expect($location.path()).toBe('/judgments/' + sampleJudgmentResponse._id);
		}));

		it('$scope.update() should update a valid Judgment', inject(function(Judgments) {
			// Define a sample Judgment put data
			var sampleJudgmentPutData = new Judgments({
				_id: '525cf20451979dea2c000001',
				name: 'New Judgment'
			});

			// Mock Judgment in scope
			scope.judgment = sampleJudgmentPutData;

			// Set PUT response
			$httpBackend.expectPUT(/judgments\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/judgments/' + sampleJudgmentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid judgmentId and remove the Judgment from the scope', inject(function(Judgments) {
			// Create new Judgment object
			var sampleJudgment = new Judgments({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Judgments array and include the Judgment
			scope.judgments = [sampleJudgment];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/judgments\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleJudgment);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.judgments.length).toBe(0);
		}));
	});
}());