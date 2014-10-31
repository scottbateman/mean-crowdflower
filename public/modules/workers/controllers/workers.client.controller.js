'use strict';

// Workers controller
angular.module('workers').controller('WorkersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Workers',
	function($scope, $stateParams, $location, Authentication, Workers ) {
		$scope.authentication = Authentication;

		// Create new Worker
		$scope.create = function() {
			// Create new Worker object
			var worker = new Workers ({
				name: this.name
			});

			// Redirect after save
			worker.$save(function(response) {
				$location.path('workers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Worker
		$scope.remove = function( worker ) {
			if ( worker ) { worker.$remove();

				for (var i in $scope.workers ) {
					if ($scope.workers [i] === worker ) {
						$scope.workers.splice(i, 1);
					}
				}
			} else {
				$scope.worker.$remove(function() {
					$location.path('workers');
				});
			}
		};

		// Update existing Worker
		$scope.update = function() {
			var worker = $scope.worker ;

			worker.$update(function() {
				$location.path('workers/' + worker._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Workers
		$scope.find = function() {
			$scope.workers = Workers.query();
		};

		// Find existing Worker
		$scope.findOne = function() {
			$scope.worker = Workers.get({ 
				workerId: $stateParams.workerId
			});
		};
	}
]);