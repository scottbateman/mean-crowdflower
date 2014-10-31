'use strict';

//Setting up route
angular.module('golds').config(['$stateProvider',
	function($stateProvider) {
		// Golds state routing
		$stateProvider.
		state('listGolds', {
			url: '/golds',
			templateUrl: 'modules/golds/views/list-golds.client.view.html'
		}).
		state('createGold', {
			url: '/golds/create',
			templateUrl: 'modules/golds/views/create-gold.client.view.html'
		}).
		state('viewGold', {
			url: '/golds/:goldId',
			templateUrl: 'modules/golds/views/view-gold.client.view.html'
		}).
		state('editGold', {
			url: '/golds/:goldId/edit',
			templateUrl: 'modules/golds/views/edit-gold.client.view.html'
		});
	}
]);