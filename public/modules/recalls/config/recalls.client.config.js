'use strict';

// Configuring the Articles module
angular.module('recalls').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Recalls', 'recalls', 'dropdown', '/recalls(/create)?');
		Menus.addSubMenuItem('topbar', 'recalls', 'List Recalls', 'recalls');
		Menus.addSubMenuItem('topbar', 'recalls', 'New Recall', 'recalls/create');
	}
]);