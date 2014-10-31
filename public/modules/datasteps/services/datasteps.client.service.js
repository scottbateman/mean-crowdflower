'use strict';

//Datasteps service used to communicate Datasteps REST endpoints
angular.module('datasteps').factory('Datasteps', ['$resource',
	function($resource) {
		return $resource('api/datasteps/:datastepId', { datastepId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);