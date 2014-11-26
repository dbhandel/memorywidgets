'use strict';

//Setting up route
angular.module('recalls').config(['$stateProvider',
	function($stateProvider) {
		// Recalls state routing
		$stateProvider.
		state('listRecalls', {
			url: '/recalls',
			templateUrl: 'modules/recalls/views/list-recalls.client.view.html'
		}).
		state('createRecall', {
			url: '/recalls/create',
			templateUrl: 'modules/recalls/views/create-recall.client.view.html'
		}).
		state('viewRecall', {
			url: '/recalls/:recallId',
			templateUrl: 'modules/recalls/views/view-recall.client.view.html'
		}).
		state('editRecall', {
			url: '/recalls/:recallId/edit',
			templateUrl: 'modules/recalls/views/edit-recall.client.view.html'
		}).
		state('studyDue', {
			url: '/study/due',
			templateUrl: 'modules/recalls/views/study.client.view.html'
		}).
		state('studySearch', {
			url: '/study/search/:query',
			templateUrl: 'modules/recalls/views/study.client.view.html'
		});	}
]);