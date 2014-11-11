'use strict';

// Jobtemplates controller
angular.module('jobtemplates').controller('JTEditCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Jobtemplates',
  function($scope, $stateParams, $location, Authentication, Jobtemplates ) {
    $scope.authentication = Authentication;
    $scope.models = ['Tweet'];

    $scope.jobtemplate = Jobtemplates.get({
      jobtemplateId: $stateParams.jobtemplateId
    });

    $scope.addField = function () {
      $scope.jobtemplate.template.confidence_fields.push("");
      console.log($scope.jobtemplate.template.confidence_fields);
    };

    $scope.removeField = function (index) {
      if(index>-1){
        $scope.jobtemplate.template.confidence_fields.splice(index, 1);
      }
    };

    // Update existing Jobtemplate
    $scope.update = function() {
      var jobtemplate = $scope.jobtemplate ;

      jobtemplate.$update(function() {
        $location.path('jobtemplates/' + jobtemplate._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
