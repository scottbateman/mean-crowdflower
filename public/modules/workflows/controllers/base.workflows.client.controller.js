'use strict';

// Workflows controller
angular.module('workflows').controller('WorkflowsBaseCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Workflows', 'Jobtemplates',
  function($scope, $stateParams, $location, Authentication, Workflows, Jobtemplates) {
    $scope.authentication = Authentication;

    $scope.logScope = function () {
      console.log($scope);
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