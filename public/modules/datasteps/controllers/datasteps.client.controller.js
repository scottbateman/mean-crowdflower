'use strict';

// Datasteps controller
angular.module('datasteps').controller('DatastepsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Datasteps',
	function($scope, $stateParams, $location, Authentication, Datasteps ) {
		$scope.authentication = Authentication;

		// Create new Datastep
		$scope.create = function() {
			// Create new Datastep object
			var datastep = new Datasteps ({
				name: this.name
			});

			// Redirect after save
			datastep.$save(function(response) {
				$location.path('datasteps/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Datastep
		$scope.remove = function( datastep ) {
			if ( datastep ) { datastep.$remove();

				for (var i in $scope.datasteps ) {
					if ($scope.datasteps [i] === datastep ) {
						$scope.datasteps.splice(i, 1);
					}
				}
			} else {
				$scope.datastep.$remove(function() {
					$location.path('datasteps');
				});
			}
		};

		// Update existing Datastep
		$scope.update = function() {
			var datastep = $scope.datastep ;

			datastep.$update(function() {
				$location.path('datasteps/' + datastep._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Datasteps
		$scope.find = function() {
			$scope.datasteps = Datasteps.query();
		};

		// Find existing Datastep
		$scope.findOne = function() {
			$scope.datastep = Datasteps.get({ 
				datastepId: $stateParams.datastepId
			});
		};
	}
]);