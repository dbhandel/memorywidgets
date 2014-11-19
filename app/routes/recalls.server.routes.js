'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var recalls = require('../../app/controllers/recalls.server.controller');

	// Recalls Routes
	app.route('/recalls')
		.get(recalls.list)
		.post(users.requiresLogin, recalls.create);

	app.route('/recalls/:recallId')
		.get(recalls.read)
		.put(users.requiresLogin, recalls.hasAuthorization, recalls.update)
		.delete(users.requiresLogin, recalls.hasAuthorization, recalls.delete);

	// Finish by binding the Recall middleware
	app.param('recallId', recalls.recallByID);
};
