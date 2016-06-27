import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Cart } from './cart.js';


// Export your method from this module
// export const create = new ValidatedMethod({
// 	name: 'cart.create',
// 	mixins: [LoggedInMixin],
// 	checkRoles: isAdminValidation,
// 	checkLoggedInError: loggedInValidation,
// 	validate: new SimpleSchema({
// 		data: {type: Object, blackbox: true}
// 	}).validator(),
// 	run({ data }) {
// 		// Create cart
// 		Cart.insert(data);
// 	}
// });
//
// // Export your method from this module
// export const update = new ValidatedMethod({
// 	name: 'cart.update',
// 	mixins: [LoggedInMixin],
// 	checkRoles: isAdminValidation,
// 	checkLoggedInError: loggedInValidation,
// 	validate: new SimpleSchema({
// 		objectId: {type: String},
// 		data: {type: Object, blackbox: true}
// 	}).validator(),
// 	run({ objectId, data }) {
// 		// Update cart
// 		Cart.update({_id: objectId}, {$set: data});
// 	}
// });
//
// // Export your method from this module
// export const remove = new ValidatedMethod({
// 	name: 'cart.remove',
// 	mixins: [LoggedInMixin],
// 	checkRoles: isAdminValidation,
// 	checkLoggedInError: loggedInValidation,
// 	validate: new SimpleSchema({
// 		objectId: {type: String}
// 	}).validator(),
// 	run({ objectId }) {
// 		// Delete cart
// 		Cart.remove({_id: objectId});
// 	}
// });


/*
 * Rate limiting for methods
 * Only runs on server
 */
if(Meteor.isServer){
	// Get list of all method names on Lists
	const METHOD_NAMES = [
		'cart.create',
		'cart.update',
		'cart.remove'
	];

	DDPRateLimiter.addRule({
		name(name) {
			return _.contains(METHOD_NAMES, name);
		},

		// Rate limit per connection ID
		connectionId() { return true; }
	}, 3, 1000*10);
}
