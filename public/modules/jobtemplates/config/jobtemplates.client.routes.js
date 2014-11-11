'use strict';

//Setting up route
angular.module('jobtemplates').config(['$stateProvider',
  function($stateProvider) {
    // Jobtemplates state routing
    $stateProvider.
      state('listJobtemplates', {
        url: '/jobtemplates',
        templateUrl: 'modules/jobtemplates/views/list-jobtemplates.client.view.html',
        controller: 'JTListCtrl'
      }).
      state('createJobtemplate', {
        url: '/jobtemplates/create',
        templateUrl: 'modules/jobtemplates/views/create-jobtemplate.client.view.html',
        controller: 'JTCreateCtrl'
      }).
      state('viewJobtemplate', {
        url: '/jobtemplates/:jobtemplateId',
        templateUrl: 'modules/jobtemplates/views/view-jobtemplate.client.view.html',
        controller: 'JTViewCtrl'
      }).
      state('editJobtemplate', {
        url: '/jobtemplates/:jobtemplateId/edit',
        templateUrl: 'modules/jobtemplates/views/edit-jobtemplate.client.view.html',
        controller: 'JTEditCtrl'
      });
  }
]);