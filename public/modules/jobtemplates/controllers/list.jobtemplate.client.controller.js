'use strict';

// Jobtemplates controller
angular.module('jobtemplates').controller('JTListCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Jobtemplates',
  function($scope, $stateParams, $location, Authentication, Jobtemplates ) {
    $scope.authentication = Authentication;

    $scope.jobtemplates = Jobtemplates.query();

    $scope.remove = function (index) {
      var jobtemplate = $scope.jobtemplates[index];
      jobtemplate.$remove();
      $scope.jobtemplates.splice(index, 1);
    }
  }
]);