'use strict';

//Setting up route
angular.module('datasteps').config(['$stateProvider',
	function($stateProvider) {
		// Datasteps state routing
		$stateProvider.
		state('listDatasteps', {
			url: '/datasteps',
			templateUrl: 'modules/datasteps/views/list-datasteps.client.view.html'
		}).
		state('createDatastep', {
			url: '/datasteps/create',
			templateUrl: 'modules/datasteps/views/create-datastep.client.view.html'
		}).
		state('viewDatastep', {
			url: '/datasteps/:datastepId',
			templateUrl: 'modules/datasteps/views/view-datastep.client.view.html'
		}).
		state('editDatastep', {
			url: '/datasteps/:datastepId/edit',
			templateUrl: 'modules/datasteps/views/edit-datastep.client.view.html'
		});
	}
]);