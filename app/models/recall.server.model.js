'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Recall Schema
 */
var RecallSchema = new Schema({
	question: {
		type: String,
		default: '',
		required: 'Please fill Recall question',
		trim: true
	},
		answer: {
		type: String,
		default: '',
		required: 'Please fill Recall answer',
		trim: true
	},
		tags: {
		type: [Schema.Types.Mixed]
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	history: [Schema.Types.Mixed]
});

mongoose.model('Recall', RecallSchema);