'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Recall = mongoose.model('Recall'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, recall;

/**
 * Recall routes tests
 */
describe('Recall CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Recall
		user.save(function() {
			recall = {
				name: 'Recall Name'
			};

			done();
		});
	});

	it('should be able to save Recall instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Recall
				agent.post('/recalls')
					.send(recall)
					.expect(200)
					.end(function(recallSaveErr, recallSaveRes) {
						// Handle Recall save error
						if (recallSaveErr) done(recallSaveErr);

						// Get a list of Recalls
						agent.get('/recalls')
							.end(function(recallsGetErr, recallsGetRes) {
								// Handle Recall save error
								if (recallsGetErr) done(recallsGetErr);

								// Get Recalls list
								var recalls = recallsGetRes.body;

								// Set assertions
								(recalls[0].user._id).should.equal(userId);
								(recalls[0].name).should.match('Recall Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Recall instance if not logged in', function(done) {
		agent.post('/recalls')
			.send(recall)
			.expect(401)
			.end(function(recallSaveErr, recallSaveRes) {
				// Call the assertion callback
				done(recallSaveErr);
			});
	});

	it('should not be able to save Recall instance if no name is provided', function(done) {
		// Invalidate name field
		recall.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Recall
				agent.post('/recalls')
					.send(recall)
					.expect(400)
					.end(function(recallSaveErr, recallSaveRes) {
						// Set message assertion
						(recallSaveRes.body.message).should.match('Please fill Recall name');
						
						// Handle Recall save error
						done(recallSaveErr);
					});
			});
	});

	it('should be able to update Recall instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Recall
				agent.post('/recalls')
					.send(recall)
					.expect(200)
					.end(function(recallSaveErr, recallSaveRes) {
						// Handle Recall save error
						if (recallSaveErr) done(recallSaveErr);

						// Update Recall name
						recall.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Recall
						agent.put('/recalls/' + recallSaveRes.body._id)
							.send(recall)
							.expect(200)
							.end(function(recallUpdateErr, recallUpdateRes) {
								// Handle Recall update error
								if (recallUpdateErr) done(recallUpdateErr);

								// Set assertions
								(recallUpdateRes.body._id).should.equal(recallSaveRes.body._id);
								(recallUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Recalls if not signed in', function(done) {
		// Create new Recall model instance
		var recallObj = new Recall(recall);

		// Save the Recall
		recallObj.save(function() {
			// Request Recalls
			request(app).get('/recalls')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Recall if not signed in', function(done) {
		// Create new Recall model instance
		var recallObj = new Recall(recall);

		// Save the Recall
		recallObj.save(function() {
			request(app).get('/recalls/' + recallObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', recall.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Recall instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Recall
				agent.post('/recalls')
					.send(recall)
					.expect(200)
					.end(function(recallSaveErr, recallSaveRes) {
						// Handle Recall save error
						if (recallSaveErr) done(recallSaveErr);

						// Delete existing Recall
						agent.delete('/recalls/' + recallSaveRes.body._id)
							.send(recall)
							.expect(200)
							.end(function(recallDeleteErr, recallDeleteRes) {
								// Handle Recall error error
								if (recallDeleteErr) done(recallDeleteErr);

								// Set assertions
								(recallDeleteRes.body._id).should.equal(recallSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Recall instance if not signed in', function(done) {
		// Set Recall user 
		recall.user = user;

		// Create new Recall model instance
		var recallObj = new Recall(recall);

		// Save the Recall
		recallObj.save(function() {
			// Try deleting Recall
			request(app).delete('/recalls/' + recallObj._id)
			.expect(401)
			.end(function(recallDeleteErr, recallDeleteRes) {
				// Set message assertion
				(recallDeleteRes.body.message).should.match('User is not logged in');

				// Handle Recall error error
				done(recallDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Recall.remove().exec();
		done();
	});
});