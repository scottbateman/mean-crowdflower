'use strict';

//Setting up route
angular.module('workflows').config(['$stateProvider',
	function($stateProvider) {
		// Workflows state routing
		$stateProvider.
		state('listWorkflows', {
			url: '/workflows',
			templateUrl: 'modules/workflows/views/list-workflows.client.view.html'
		}).
		state('createWorkflow', {
			url: '/workflows/create',
			templateUrl: 'modules/workflows/views/create-workflow.client.view.html'
		}).
		state('viewWorkflow', {
			url: '/workflows/:workflowId',
			templateUrl: 'modules/workflows/views/view-workflow.client.view.html'
		}).
		state('editWorkflow', {
			url: '/workflows/:workflowId/edit',
			templateUrl: 'modules/workflows/views/edit-workflow.client.view.html'
		});
	}
]);