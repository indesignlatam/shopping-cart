import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Cart = {};

Cart.Items = new Mongo.Collection('cart-items');


/*
 * Collection schema
 *
 */
const schemas = {};

schemas.cart = new SimpleSchema({
	deviceId: {
		type: String,
		label: 'Dispositivo',
		optional: true
	},
	userId: {
		type: String,
		label: 'Usuario',
		optional: true
	},
	productId: {
		type: String,
		label: 'Id de producto'
	},
	price: {
		type: Number,
		label: 'Precio'
	},
	amount: {
		type: Number,
		label: 'Cantidad'
	},
	product: {
		type: Object,
		label: 'Producto',
		blackbox: true,
		optional: true
	},
	'product.tax': {
		type: Object,
		blackbox: true,
		optional: true
	},
	updatedAt: {
		type: Date,
		autoValue() {
			return new Date();
		}
	}
});

Cart.Items.attachSchema(schemas.cart);


/*
 * Collection fields
 * Public fields
 *
 */
Cart.Items.publicFields = {
	name: true
};

/*
 * Collection fields
 * Basic fields
 *
 */
Cart.Items.basicFields = {
	name: true
};


/*
 * Collection helpers
 *
 */
Cart.Items.helpers({
    helper: () => {
		return '';
	}
});


/*
 * Collection permissions
 * Deny all actions on client-side
 *
 */
// Cart.deny({
// 	insert() {
// 		return true;
// 	},
// 	update() {
// 		return true;
// 	},
// 	remove() {
// 		return true;
// 	}
// });

Cart.Items.allow({
	insert(userId, doc) {
		return (userId && doc && userId === doc.userId) || (!userId && doc && doc.deviceId && !doc.userId);
	},
	update(userId, doc, fieldNames, modifier) {
		return (userId && doc && userId === doc.userId) || (doc && doc.deviceId && !doc.userId);
	},
	remove(userId, doc) {
		return (userId && doc && userId === doc.userId) || (doc && doc.deviceId && !doc.userId);
	},
	fetch: ['userId','deviceId']
});
