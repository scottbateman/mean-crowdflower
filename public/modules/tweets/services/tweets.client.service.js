'use strict';

//Tweets service used to communicate Tweets REST endpoints
angular.module('tweets').factory('Tweets', ['$resource',
	function($resource) {
		return $resource('api/tweets/:tweetId', { tweetId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);