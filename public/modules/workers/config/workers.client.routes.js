'use strict';

//Setting up route
angular.module('workers').config(['$stateProvider',
	function($stateProvider) {
		// Workers state routing
		$stateProvider.
		state('listWorkers', {
			url: '/workers',
			templateUrl: 'modules/workers/views/list-workers.client.view.html'
		}).
		state('createWorker', {
			url: '/workers/create',
			templateUrl: 'modules/workers/views/create-worker.client.view.html'
		}).
		state('viewWorker', {
			url: '/workers/:workerId',
			templateUrl: 'modules/workers/views/view-worker.client.view.html'
		}).
		state('editWorker', {
			url: '/workers/:workerId/edit',
			templateUrl: 'modules/workers/views/edit-worker.client.view.html'
		});
	}
]);