'use strict';

angular.module('jobtemplates')
  .controller('JTViewCtrl',
  ['$scope', '$stateParams', 'Authentication', 'Jobtemplates',
    function($scope, $stateParams,  Authentication, Jobtemplates ) {
      $scope.authentication = Authentication;

      $scope.jobtemplate = Jobtemplates.get({
        jobtemplateId: $stateParams.jobtemplateId
      });
    }
  ]);