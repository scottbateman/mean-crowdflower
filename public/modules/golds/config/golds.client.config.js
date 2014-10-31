'use strict';

// Configuring the Articles module
angular.module('golds').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Golds', 'golds', 'dropdown', '/golds(/create)?');
		Menus.addSubMenuItem('topbar', 'golds', 'List Golds', 'golds');
		Menus.addSubMenuItem('topbar', 'golds', 'New Gold', 'golds/create');
	}
]);