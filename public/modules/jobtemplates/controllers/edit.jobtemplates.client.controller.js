'use strict';

// Jobtemplates controller
angular.module('jobtemplates').controller('JTEditCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Jobtemplates',
  function($scope, $stateParams, $location, Authentication, Jobtemplates ) {
    $scope.authentication = Authentication;
    $scope.fields = [];


    $scope.jobtemplate = Jobtemplates.get(
      {  jobtemplateId: $stateParams.jobtemplateId  }, // Query
      function (jts) {
        var fields = $scope.jobtemplate.fields;
        for(var i=0; i<fields.length; i++){
          $scope.fields.push({
            value: fields[i]
          });
        }
    });

    $scope.addField = function () {
      $scope.fields.push({value:""});
    };

    $scope.removeField = function (index) {
      if(index>-1){
        $scope.fields.splice(index, 1);
      }
    };

    // Update existing Jobtemplate
    $scope.update = function() {
      var jobtemplate = $scope.jobtemplate ;
      for (var i=0; i<$scope.fields.length; i++){
        jobtemplate.fields[i] = $scope.fields[i].value;
      }

      jobtemplate.$update(function() {
        $location.path('jobtemplates/' + jobtemplate._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
