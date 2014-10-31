'use strict';

//Setting up route
angular.module('jobtemplates').config(['$stateProvider',
	function($stateProvider) {
		// Jobtemplates state routing
		$stateProvider.
		state('listJobtemplates', {
			url: '/jobtemplates',
			templateUrl: 'modules/jobtemplates/views/list-jobtemplates.client.view.html'
		}).
		state('createJobtemplate', {
			url: '/jobtemplates/create',
			templateUrl: 'modules/jobtemplates/views/create-jobtemplate.client.view.html'
		}).
		state('viewJobtemplate', {
			url: '/jobtemplates/:jobtemplateId',
			templateUrl: 'modules/jobtemplates/views/view-jobtemplate.client.view.html'
		}).
		state('editJobtemplate', {
			url: '/jobtemplates/:jobtemplateId/edit',
			templateUrl: 'modules/jobtemplates/views/edit-jobtemplate.client.view.html'
		});
	}
]);