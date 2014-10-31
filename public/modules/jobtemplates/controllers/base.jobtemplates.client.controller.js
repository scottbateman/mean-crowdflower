'use strict';

// Jobtemplates controller
angular.module('jobtemplates').controller('JTBaseCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Jobtemplates',
  function($scope, $stateParams, $location, Authentication, Jobtemplates ) {
    $scope.authentication = Authentication;

    $scope.models = ['Tweet'];

    // Find a list of Jobtemplates
    $scope.find = function() {
      $scope.jobtemplates = Jobtemplates.query();
    };

    // Find existing Jobtemplate
    $scope.findOne = function() {
      $scope.jobtemplate = Jobtemplates.get({
        jobtemplateId: $stateParams.jobtemplateId
      });
      console.log($scope);
    };
  }
]);
