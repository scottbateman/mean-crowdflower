'use strict';

// Jobtemplates controller
angular.module('jobtemplates').controller('JobtemplatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Jobtemplates',
	function($scope, $stateParams, $location, Authentication, Jobtemplates ) {
		$scope.authentication = Authentication;

    $scope.models = ['Tweet'];

    $scope.addField = function () {
      $scope.fields.push({value:""});

    };

    $scope.removeField = function (index) {
      if(index>-1){
        $scope.fields.splice(index, 1);
      }
    };

    $scope.prepCreate= function () {
      $scope.fields = [];
    };

		// Create new Jobtemplate
		$scope.create = function() {
      /** @todo Make a create controller. */
      var fields = [];
      for(var i=0; i< this.fields.length; i++){
        fields.push(this.fields[i].value);
      }

			// Create new Jobtemplate object
			var jobtemplate = new Jobtemplates ({
				name: this.name,
        model: this.model,
        template: {
          css: this.css,
          js: this.js,
          cml: this.cml
        },
        fields: fields
			});

			// Redirect after save
			jobtemplate.$save(function(response) {
				$location.path('jobtemplates/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Jobtemplate
		$scope.remove = function( jobtemplate ) {
      /** @todo move to another controller. */
			if ( jobtemplate ) { jobtemplate.$remove();

				for (var i in $scope.jobtemplates ) {
					if ($scope.jobtemplates [i] === jobtemplate ) {
						$scope.jobtemplates.splice(i, 1);
					}
				}
			} else {
				$scope.jobtemplate.$remove(function() {
					$location.path('jobtemplates');
				});
			}
		};


		// Find a list of Jobtemplates
		$scope.find = function() {
			$scope.jobtemplates = Jobtemplates.query();
		};

		// Find existing Jobtemplate
		$scope.findOne = function() {
			$scope.jobtemplate = Jobtemplates.get({ 
				jobtemplateId: $stateParams.jobtemplateId
			});
		};
	}
]);