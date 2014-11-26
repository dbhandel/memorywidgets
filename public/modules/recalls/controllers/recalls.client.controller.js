'use strict';

// Recalls controller
angular.module('recalls').controller('RecallsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Recalls', '$filter',
	function($scope, $stateParams, $location, Authentication, Recalls, $filter) {
		$scope.authentication = Authentication;

		//check if user logged in
		if(!Authentication.user) {
			$location.path('signin');
		}

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
				$location.path('recalls');

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
			console.log(recall);
			recall.$update(function() {
				$location.path('recalls');
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
		$scope.studyList = function(searchQuery) {
			var path = $location.path();
			console.log(path);
			if(path === '/study/due') {
							//get due recalls but for now get all recalls ///sorted by date created
						$scope.recalls = Recalls.query();
			} else {
				var query = path.split('/')[3];
				$scope.recalls = Recalls.query();
			}
			//console.log($scope.recalls);
		}
	}
]);