'use strict';

// Golds controller
angular.module('golds').controller('GoldsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Golds',
	function($scope, $stateParams, $location, Authentication, Golds ) {
		$scope.authentication = Authentication;

		// Create new Gold
		$scope.create = function() {
			// Create new Gold object
			var gold = new Golds ({
				name: this.name
			});

			// Redirect after save
			gold.$save(function(response) {
				$location.path('golds/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Gold
		$scope.remove = function( gold ) {
			if ( gold ) { gold.$remove();

				for (var i in $scope.golds ) {
					if ($scope.golds [i] === gold ) {
						$scope.golds.splice(i, 1);
					}
				}
			} else {
				$scope.gold.$remove(function() {
					$location.path('golds');
				});
			}
		};

		// Update existing Gold
		$scope.update = function() {
			var gold = $scope.gold ;

			gold.$update(function() {
				$location.path('golds/' + gold._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Golds
		$scope.find = function() {
			$scope.golds = Golds.query();
		};

		// Find existing Gold
		$scope.findOne = function() {
			$scope.gold = Golds.get({ 
				goldId: $stateParams.goldId
			});
		};
	}
]);