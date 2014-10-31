'use strict';

//Workers service used to communicate Workers REST endpoints
angular.module('workers').factory('Workers', ['$resource',
	function($resource) {
		return $resource('api/workers/:workerId', { workerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);