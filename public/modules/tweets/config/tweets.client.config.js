'use strict';

// Configuring the Articles module
angular.module('tweets').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tweets', 'tweets', 'dropdown', '/tweets(/create)?');
		Menus.addSubMenuItem('topbar', 'tweets', 'List Tweets', 'tweets');
		Menus.addSubMenuItem('topbar', 'tweets', 'New Tweet', 'tweets/create');
	}
]);