'use strict';

//Recalls service used to communicate Recalls REST endpoints
angular.module('recalls').factory('Recalls', ['$resource',
	function($resource) {
		return $resource('recalls/:recallId', { recallId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);