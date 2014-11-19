'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Recall = mongoose.model('Recall'),
	_ = require('lodash');

/**
 * Create a Recall
 */
exports.create = function(req, res) {
	var recall = new Recall(req.body);
	recall.user = req.user;

	recall.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(recall);
		}
	});
};

/**
 * Show the current Recall
 */
exports.read = function(req, res) {
	res.jsonp(req.recall);
};

/**
 * Update a Recall
 */
exports.update = function(req, res) {
	var recall = req.recall ;

	recall = _.extend(recall , req.body);

	recall.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(recall);
		}
	});
};

/**
 * Delete an Recall
 */
exports.delete = function(req, res) {
	var recall = req.recall ;

	recall.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(recall);
		}
	});
};

/**
 * List of Recalls
 */
exports.list = function(req, res) { 
	Recall.find().sort('-created').populate('user', 'displayName').exec(function(err, recalls) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(recalls);
		}
	});
};

/**
 * Recall middleware
 */
exports.recallByID = function(req, res, next, id) { 
	Recall.findById(id).populate('user', 'displayName').exec(function(err, recall) {
		if (err) return next(err);
		if (! recall) return next(new Error('Failed to load Recall ' + id));
		req.recall = recall ;
		next();
	});
};

/**
 * Recall authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.recall.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
