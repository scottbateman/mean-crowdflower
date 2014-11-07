'use strict';

// Workflows controller
angular.module('workflows').controller('WorkflowsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Workflows', 'Jobtemplates',
	function($scope, $stateParams, $location, Authentication, Workflows, Jobtemplates) {
		$scope.authentication = Authentication;

    $scope.addStep = function () {
      $scope.steps.push({});
    };
    $scope.logScope = function () {
      console.log($scope);
    };

    $scope.removeStep = function (index) {
      if (index > -1) {
        $scope.steps.splice(index, 1);
      }
    };

    $scope.loadStepTemplate = function (step) {
      step.templateObject = Jobtemplates.get({
        jobtemplateId: step.template
      });
    };

    $scope.prepCreate= function () {
      $scope.steps = [];
      $scope.models = ['Tweet', 'Farts'];
    };

    $scope.prepEdit = function () {
      $scope.models = ['Tweet', 'Farts'];
      $scope.loadTemplates($scope.workflow.model);
    };

    $scope.loadTemplates = function (model) {
      $scope.templates = Jobtemplates.query({model:model});
    };

    $scope.setFields = function (step, templateIndex) {
      step.template = $scope.templates[templateIndex]._id;
      step.queue = [];

      step.requirements = [];
      for(var i=0; i<$scope.templates[templateIndex].fields.length; i++){
        step.requirements.push({
          field: $scope.templates[templateIndex].fields[i]
        });
      }
    };

		// Create new Workflow
		$scope.create = function() {
			// Create new Workflow object
			var workflow = new Workflows ({
				name: this.name,
        active: this.active ? this.active : false,
        apiKey: this.apiKey,
        model: this.model,
        steps: this.steps

			});

      console.log(JSON.stringify(workflow));

			// Redirect after save
			workflow.$save(function(response) {
				$location.path('workflows/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Workflow


		// Update existing Workflow
		$scope.update = function() {
			var workflow = $scope.workflow ;

			workflow.$update(function() {
				$location.path('workflows/' + workflow._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Workflows
		$scope.find = function() {
			$scope.workflows = Workflows.query();
		};

		// Find existing Workflow
		$scope.findOne = function() {
			$scope.workflow = Workflows.get({
				workflowId: $stateParams.workflowId
			});
		};
	}
]);