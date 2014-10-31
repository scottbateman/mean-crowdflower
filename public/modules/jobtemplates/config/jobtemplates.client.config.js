'use strict';

// Configuring the Articles module
angular.module('jobtemplates').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Jobtemplates', 'jobtemplates', 'dropdown', '/jobtemplates(/create)?');
		Menus.addSubMenuItem('topbar', 'jobtemplates', 'List Jobtemplates', 'jobtemplates');
		Menus.addSubMenuItem('topbar', 'jobtemplates', 'New Jobtemplate', 'jobtemplates/create');
	}
]);