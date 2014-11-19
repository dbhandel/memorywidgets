'use strict';

(function() {
	// Recalls Controller Spec
	describe('Recalls Controller Tests', function() {
		// Initialize global variables
		var RecallsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Recalls controller.
			RecallsController = $controller('RecallsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Recall object fetched from XHR', inject(function(Recalls) {
			// Create sample Recall using the Recalls service
			var sampleRecall = new Recalls({
				name: 'New Recall'
			});

			// Create a sample Recalls array that includes the new Recall
			var sampleRecalls = [sampleRecall];

			// Set GET response
			$httpBackend.expectGET('recalls').respond(sampleRecalls);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.recalls).toEqualData(sampleRecalls);
		}));

		it('$scope.findOne() should create an array with one Recall object fetched from XHR using a recallId URL parameter', inject(function(Recalls) {
			// Define a sample Recall object
			var sampleRecall = new Recalls({
				name: 'New Recall'
			});

			// Set the URL parameter
			$stateParams.recallId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/recalls\/([0-9a-fA-F]{24})$/).respond(sampleRecall);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.recall).toEqualData(sampleRecall);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Recalls) {
			// Create a sample Recall object
			var sampleRecallPostData = new Recalls({
				name: 'New Recall'
			});

			// Create a sample Recall response
			var sampleRecallResponse = new Recalls({
				_id: '525cf20451979dea2c000001',
				name: 'New Recall'
			});

			// Fixture mock form input values
			scope.name = 'New Recall';

			// Set POST response
			$httpBackend.expectPOST('recalls', sampleRecallPostData).respond(sampleRecallResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Recall was created
			expect($location.path()).toBe('/recalls/' + sampleRecallResponse._id);
		}));

		it('$scope.update() should update a valid Recall', inject(function(Recalls) {
			// Define a sample Recall put data
			var sampleRecallPutData = new Recalls({
				_id: '525cf20451979dea2c000001',
				name: 'New Recall'
			});

			// Mock Recall in scope
			scope.recall = sampleRecallPutData;

			// Set PUT response
			$httpBackend.expectPUT(/recalls\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/recalls/' + sampleRecallPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid recallId and remove the Recall from the scope', inject(function(Recalls) {
			// Create new Recall object
			var sampleRecall = new Recalls({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Recalls array and include the Recall
			scope.recalls = [sampleRecall];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/recalls\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRecall);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.recalls.length).toBe(0);
		}));
	});
}());