'use strict';

// Configuring the Articles module
angular.module('workflows').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Workflows', 'workflows', 'dropdown', '/workflows(/create)?');
		Menus.addSubMenuItem('topbar', 'workflows', 'List Workflows', 'workflows');
		Menus.addSubMenuItem('topbar', 'workflows', 'New Workflow', 'workflows/create');
	}
]);