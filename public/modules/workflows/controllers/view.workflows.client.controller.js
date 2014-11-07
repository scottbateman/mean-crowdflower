'use strict';

// Workflows controller
angular.module('workflows').controller('WorkflowsViewCtrl',
  ['$scope', '$stateParams', '$location', 'Authentication', 'Workflows', 'Jobtemplates',
    function($scope, $stateParams, $location, Authentication, Workflows, Jobtemplates) {
      $scope.authentication = Authentication;

      $scope.clearStepQueue = function (stepIndex) {
        $scope.workflow.steps[stepIndex].queue = [];

        $scope.workflow.$update(function() {
          $location.path('workflows/' + workflow._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };


      $scope.remove = function( workflow ) {
        if ( workflow ) { workflow.$remove();

          for (var i in $scope.workflows ) {
            if ($scope.workflows [i] === workflow ) {
              $scope.workflows.splice(i, 1);
            }
          }
        } else {
          $scope.workflow.$remove(function() {
            $location.path('workflows');
          });
        }
      };

    }
  ]);
