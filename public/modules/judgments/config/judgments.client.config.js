'use strict';

// Configuring the Articles module
angular.module('judgments').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Judgments', 'judgments', 'dropdown', '/judgments(/create)?');
		Menus.addSubMenuItem('topbar', 'judgments', 'List Judgments', 'judgments');
		Menus.addSubMenuItem('topbar', 'judgments', 'New Judgment', 'judgments/create');
	}
]);