'use strict';

// Recalls controller
angular.module('recalls').controller('RecallsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Recalls',
	function($scope, $stateParams, $location, Authentication, Recalls) {
		$scope.authentication = Authentication;

		// Create new Recall
		this.create = function() {
			// Create new Recall object
			var recall = new Recalls ({
				question: this.question,
				answer: this.answer,
				tags: this.tags
			});
			console.log(recall);
			// Redirect after save
			recall.$save(function(response) {
				$location.path('recalls/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Recall
		$scope.remove = function(recall) {
			if ( recall ) { 
				recall.$remove();

				for (var i in $scope.recalls) {
					if ($scope.recalls [i] === recall) {
						$scope.recalls.splice(i, 1);
					}
				}
			} else {
				$scope.recall.$remove(function() {
					$location.path('recalls');
				});
			}
		};

		// Update existing Recall
		$scope.update = function() {
			var recall = $scope.recall;

			recall.$update(function() {
				$location.path('recalls/' + recall._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Recalls
		$scope.find = function() {
			$scope.recalls = Recalls.query();
		};

		// Find existing Recall
		$scope.findOne = function() {
			$scope.recall = Recalls.get({ 
				recallId: $stateParams.recallId
			});
		};
	}
]);