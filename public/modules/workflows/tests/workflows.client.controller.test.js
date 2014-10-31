'use strict';

(function() {
	// Workflows Controller Spec
	describe('Workflows Controller Tests', function() {
		// Initialize global variables
		var WorkflowsController,
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

			// Initialize the Workflows controller.
			WorkflowsController = $controller('WorkflowsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Workflow object fetched from XHR', inject(function(Workflows) {
			// Create sample Workflow using the Workflows service
			var sampleWorkflow = new Workflows({
				name: 'New Workflow'
			});

			// Create a sample Workflows array that includes the new Workflow
			var sampleWorkflows = [sampleWorkflow];

			// Set GET response
			$httpBackend.expectGET('workflows').respond(sampleWorkflows);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.workflows).toEqualData(sampleWorkflows);
		}));

		it('$scope.findOne() should create an array with one Workflow object fetched from XHR using a workflowId URL parameter', inject(function(Workflows) {
			// Define a sample Workflow object
			var sampleWorkflow = new Workflows({
				name: 'New Workflow'
			});

			// Set the URL parameter
			$stateParams.workflowId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/workflows\/([0-9a-fA-F]{24})$/).respond(sampleWorkflow);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.workflow).toEqualData(sampleWorkflow);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Workflows) {
			// Create a sample Workflow object
			var sampleWorkflowPostData = new Workflows({
				name: 'New Workflow'
			});

			// Create a sample Workflow response
			var sampleWorkflowResponse = new Workflows({
				_id: '525cf20451979dea2c000001',
				name: 'New Workflow'
			});

			// Fixture mock form input values
			scope.name = 'New Workflow';

			// Set POST response
			$httpBackend.expectPOST('workflows', sampleWorkflowPostData).respond(sampleWorkflowResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Workflow was created
			expect($location.path()).toBe('/workflows/' + sampleWorkflowResponse._id);
		}));

		it('$scope.update() should update a valid Workflow', inject(function(Workflows) {
			// Define a sample Workflow put data
			var sampleWorkflowPutData = new Workflows({
				_id: '525cf20451979dea2c000001',
				name: 'New Workflow'
			});

			// Mock Workflow in scope
			scope.workflow = sampleWorkflowPutData;

			// Set PUT response
			$httpBackend.expectPUT(/workflows\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/workflows/' + sampleWorkflowPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid workflowId and remove the Workflow from the scope', inject(function(Workflows) {
			// Create new Workflow object
			var sampleWorkflow = new Workflows({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Workflows array and include the Workflow
			scope.workflows = [sampleWorkflow];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/workflows\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWorkflow);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.workflows.length).toBe(0);
		}));
	});
}());