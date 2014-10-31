'use strict';

// Workflows controller
angular.module('workflows').controller('WorkflowsEditCtrl',
  ['$scope', '$stateParams', '$location', 'Authentication', 'Workflows', 'Jobtemplates',
  function($scope, $stateParams, $location, Authentication, Workflows, Jobtemplates) {
    $scope.authentication = Authentication;
    $scope.models = ['Tweet'];

    $scope.addStep = function () {
      $scope.workflow.steps.push({});
    };

    $scope.removeStep = function (index) {
      if (index > -1) {
        $scope.workflow.steps.splice(index, 1);
      }
    };

    $scope.loadStepTemplate = function (step) {
      alert('loadStepTemplate');
      step.templateObject = Jobtemplates.get({
        jobtemplateId: step.template
      });
    };

    $scope.prepEdit = function () {
      $scope.loadTemplates($scope.workflow.model);
    };

    $scope.loadTemplates = function (model) {
      $scope.templates = Jobtemplates.query({model:model});
    };

    $scope.loadFields = function (step, templateIndex) {
      step.template = $scope.templates[templateIndex]._id;
      step.queue = [];

      step.requirements = [];
      for(var i=0; i<$scope.templates[templateIndex].fields.length; i++){
        step.requirements.push({
          field: $scope.templates[templateIndex].fields[i]
        });
      }
    };

    // Update existing Workflow
    $scope.update = function() {
      var workflow = $scope.workflow ;

      workflow.$update(function() {
        $location.path('workflows/' + workflow._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);