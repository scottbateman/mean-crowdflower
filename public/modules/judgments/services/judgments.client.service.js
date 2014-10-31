'use strict';

//Judgments service used to communicate Judgments REST endpoints
angular.module('judgments').factory('Judgments', ['$resource',
	function($resource) {
		return $resource('api/judgments/:judgmentId', { judgmentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);