'use strict';

//Jobtemplates service used to communicate Jobtemplates REST endpoints
angular.module('jobtemplates').factory('Jobtemplates', ['$resource',
	function($resource) {
		return $resource('api/jobtemplates/:jobtemplateId', { jobtemplateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);