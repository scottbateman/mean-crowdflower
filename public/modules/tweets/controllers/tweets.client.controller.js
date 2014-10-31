'use strict';

// Tweets controller
angular.module('tweets').controller('TweetsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tweets',
	function($scope, $stateParams, $location, Authentication, Tweets ) {
		$scope.authentication = Authentication;

		// Create new Tweet
		$scope.create = function() {
			// Create new Tweet object
			var tweet = new Tweets ({
				name: this.name
			});

			// Redirect after save
			tweet.$save(function(response) {
				$location.path('tweets/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tweet
		$scope.remove = function( tweet ) {
			if ( tweet ) { tweet.$remove();

				for (var i in $scope.tweets ) {
					if ($scope.tweets [i] === tweet ) {
						$scope.tweets.splice(i, 1);
					}
				}
			} else {
				$scope.tweet.$remove(function() {
					$location.path('tweets');
				});
			}
		};

		// Update existing Tweet
		$scope.update = function() {
			var tweet = $scope.tweet ;

			tweet.$update(function() {
				$location.path('tweets/' + tweet._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tweets
		$scope.find = function() {
			$scope.tweets = Tweets.query();
		};

		// Find existing Tweet
		$scope.findOne = function() {
			$scope.tweet = Tweets.get({ 
				tweetId: $stateParams.tweetId
			});
		};
	}
]);