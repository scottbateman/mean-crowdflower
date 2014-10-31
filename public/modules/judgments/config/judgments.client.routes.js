'use strict';

//Setting up route
angular.module('judgments').config(['$stateProvider',
	function($stateProvider) {
		// Judgments state routing
		$stateProvider.
		state('listJudgments', {
			url: '/judgments',
			templateUrl: 'modules/judgments/views/list-judgments.client.view.html'
		}).
		state('createJudgment', {
			url: '/judgments/create',
			templateUrl: 'modules/judgments/views/create-judgment.client.view.html'
		}).
		state('viewJudgment', {
			url: '/judgments/:judgmentId',
			templateUrl: 'modules/judgments/views/view-judgment.client.view.html'
		}).
		state('editJudgment', {
			url: '/judgments/:judgmentId/edit',
			templateUrl: 'modules/judgments/views/edit-judgment.client.view.html'
		});
	}
]);