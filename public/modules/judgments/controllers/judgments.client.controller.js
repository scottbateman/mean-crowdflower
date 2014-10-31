'use strict';

// Judgments controller
angular.module('judgments').controller('JudgmentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Judgments',
	function($scope, $stateParams, $location, Authentication, Judgments ) {
		$scope.authentication = Authentication;

		// Create new Judgment
		$scope.create = function() {
			// Create new Judgment object
			var judgment = new Judgments ({
				name: this.name
			});

			// Redirect after save
			judgment.$save(function(response) {
				$location.path('judgments/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Judgment
		$scope.remove = function( judgment ) {
			if ( judgment ) { judgment.$remove();

				for (var i in $scope.judgments ) {
					if ($scope.judgments [i] === judgment ) {
						$scope.judgments.splice(i, 1);
					}
				}
			} else {
				$scope.judgment.$remove(function() {
					$location.path('judgments');
				});
			}
		};

		// Update existing Judgment
		$scope.update = function() {
			var judgment = $scope.judgment ;

			judgment.$update(function() {
				$location.path('judgments/' + judgment._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Judgments
		$scope.find = function() {
			$scope.judgments = Judgments.query();
		};

		// Find existing Judgment
		$scope.findOne = function() {
			$scope.judgment = Judgments.get({ 
				judgmentId: $stateParams.judgmentId
			});
		};
	}
]);