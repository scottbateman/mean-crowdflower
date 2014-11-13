'use strict';

// Jobtemplates controller
angular.module('jobtemplates').controller('JTCreateCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Jobtemplates',
  function($scope, $stateParams, $location, Authentication, Jobtemplates ) {
    $scope.authentication = Authentication;
    /** @todo fetch list of data models */
    $scope.models = [];

    $scope.jobtemplate = {
      template: {
        confidence_fields: [],
        options: {
          front_load: true
        }
      }
    };

    $scope.addField = function () {
      $scope.jobtemplate.template.confidence_fields.push("");
      console.log($scope.jobtemplate.template.confidence_fields);
    };

    $scope.removeField = function (index) {
      if(index>-1){
        $scope.jobtemplate.template.confidence_fields.splice(index, 1);
      }
    };

    $scope.create = function() {
      // Create new Jobtemplate object
      var jobtemplate = new Jobtemplates (this.jobtemplate);

      // Redirect after save
      jobtemplate.$save(function(response) {
        $location.path('jobtemplates/' + response._id);

        // Clear form fields
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

  }
]);