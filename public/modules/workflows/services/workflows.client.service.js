'use strict';

//Workflows service used to communicate Workflows REST endpoints
angular.module('workflows').factory('Workflows', ['$resource',
	function($resource) {
		return $resource('api/workflows/:workflowId', { workflowId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);