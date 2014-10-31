'use strict';

//Golds service used to communicate Golds REST endpoints
angular.module('golds').factory('Golds', ['$resource',
	function($resource) {
		return $resource('api/golds/:goldId', { goldId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);