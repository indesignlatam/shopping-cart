import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Tracker } from 'meteor/tracker';
import { amplify } from 'meteor/amplify';
import { ReactiveVar } from 'meteor/reactive-var';

import { Cart } from '../imports/api/cart/cart.js';
export { Cart } from '../imports/api/cart/cart.js';


Cart.userId 		= new ReactiveVar();
Cart.deviceId 		= new ReactiveVar();

Cart.coupon 		= new ReactiveVar();
Cart.address 		= new ReactiveVar();
Cart.creditcard		= new ReactiveVar();

Cart.itemsCount = new ReactiveVar(0);
Cart.subtotal 	= new ReactiveVar(0);
Cart.shipping 	= new ReactiveVar(5000);
Cart.credits 	= new ReactiveVar(0);
Cart.discount 	= new ReactiveVar(0);
Cart.total 		= new ReactiveVar(0);



Cart.addToCart = function(product) {
	if(product.stock <= 0){
		return {error: 'out-of-stock'};
	}

	let item  = {};
	let query = {};

	if(!Meteor.userId()){
		item.deviceId   = Cart.deviceId.get();
		query.deviceId  = Cart.deviceId.get();
	}else{
		item.userId     = Meteor.userId();
		query.userId    = Meteor.userId();
	}

	// Set Product ID
	item.productId  = product._id;
	query.productId = product._id;

	item.price = product.price;
	item.product = {
		_id: product._id,
		name: product.name,
		price: product.price,
		stock: product.stock,
		unit: product.unit,
		categoryId: product.categoryId,
		image: product.image,
		tax: {
			_id: product.tax._id,
			rate: product.tax.rate,
			slug: product.tax.slug
		}
	};

	const existingItem = Cart.Items.findOne(query, {fields: {amount: true, _id: true}});

	if(existingItem && product.stock <= existingItem.amount){
		return {error: 'out-of-stock'};
	}

	if(existingItem){
		let amount = existingItem.amount;
		amount++;

		Cart.Items.update({_id: existingItem._id}, {$set: {
			amount: amount,
			price: product.price,
			'product.price': product.price,
			'product.stock': product.stock
		}});
	}else{
		item.amount = 1;

		Cart.Items.insert(item);
	}
};

Cart.removeOneCart = function(product) {
	let query = {};

	if(!Meteor.userId()){
		query.deviceId = Cart.deviceId.get();
	}else{
		query.userId = Meteor.userId();
	}

	// Set Product ID
	query.productId = product._id;

	const existingItem = Cart.Items.findOne(query, {fields: {amount: true, _id: true}});

	if(existingItem){
		let amount = existingItem.amount;
		// If items have no more to substract, delete it
		if(amount <= 1){
			Cart.Items.remove({_id: existingItem._id});
		}else{
			amount--;
			Cart.Items.update({_id: existingItem._id}, {$set: {
				amount: amount,
				price: product.price
			}});
		}
	}
};

Cart.removeItem = function(itemId) {
	Cart.Items.remove({_id: itemId});
};

Cart.itemsInCart = function(productId) {
	let count = 0;
	let query = {
		productId: productId
	};

	if(Meteor.userId()){
		query.userId = Meteor.userId();
	}else{
		query.deviceId = Cart.deviceId.get();
	}

	const cartItem = Cart.Items.findOne(query);

	if(cartItem){
		count = cartItem.amount;
	}

	return count;
};

Cart.getItems = function() {
	let query = {};

	if(Meteor.userId()){
		query.userId = Meteor.userId();
	}else{
		query.deviceId = Cart.deviceId.get();
	}

	return Cart.Items.find(query);
};



Cart.subscriptionHandles = {
	userOrders: Meteor.subscribe('Cart-userOrders')
};

Tracker.autorun(function() {
	if(Cart.deviceId.get()){
		Cart.subscriptionHandles.deviceOrders = Meteor.subscribe('Cart-deviceOrders', Cart.deviceId.get());
	}
});

Tracker.autorun(function() {
	if(!Meteor.userId() && !Cart.deviceId.get()){
		let deviceId = amplify.store('Cart-deviceId');

		if(!deviceId){
			deviceId = Random.id();
			amplify.store('Cart-deviceId', deviceId);
		}

		Cart.deviceId.set(deviceId);
	}else if(Meteor.userId()){
		const query = {
			userId: {$exists: false},
			deviceId: Cart.deviceId.get()
		};

		const options = {
			fields:{
				userId: true,
				deviceId: true
			}
		};

		const modifier = {
			$set: {
				userId: Meteor.userId()
			},
			$unset: {
				deviceId: true
			}
		};

		const items = Cart.Items.find(query, options);

		items.forEach(function(order) {
			Cart.Items.update({_id: order._id}, modifier, (error) => {
				if(error){
					console.log(error);
				}
			});
		});

		Cart.deviceId.set(null);
	}
});


// Autorun for subtotal calculation
Tracker.autorun(function() {
	let query = {};

	if(Meteor.userId()){
		query.userId = Meteor.userId();
	}else{
		query.deviceId = Cart.deviceId.get();
	}

	let total 	= 0;
	const items = Cart.Items.find(query, {fields: {price: true, amount: true}});

	items.forEach((item) => {
		total += item.price * item.amount;
	});

	Cart.subtotal.set(Math.floor(total*100)/100);
	Cart.itemsCount.set(items.count());
});

// Autorun for coupon discounts
Tracker.autorun(function() {
	const coupon = Cart.coupon.get();

	if(coupon && Cart.subtotal.get() > coupon.orderMin){
		if(coupon.type == '%'){
			Cart.discount.set(Cart.subtotal.get() * (coupon.value/100));
		}else if(coupon.type == '$'){
			Cart.discount.set(coupon.value);
		}
	}else{
		Cart.discount.set(0);
	}
});

// Autorun for credits and total calculation
Tracker.autorun(function() {
	// Calculate credits
	if(Meteor.user()){
		const credits 	= Meteor.user().profile.credits || 0;
		const total 	= Cart.subtotal.get() + Cart.shipping.get() - Cart.discount.get();

		if(credits > total){
			Cart.credits.set(total);
		}else{
			Cart.credits.set(credits);
		}
	}

	// Calculate total
	Cart.total.set(Cart.subtotal.get() + Cart.shipping.get() - Cart.discount.get() - Cart.credits.get());
});
