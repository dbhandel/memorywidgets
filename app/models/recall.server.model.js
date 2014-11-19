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
	name: {
		type: String,
		default: '',
		required: 'Please fill Recall name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Recall', RecallSchema);