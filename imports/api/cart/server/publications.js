import { Meteor } from 'meteor/meteor';
import { Cart } from '../cart.js';


Meteor.publish('Cart-userOrders', function() {
	if(this.userId){
		return Cart.Items.find({userId: this.userId});
	}

	return this.ready();
});

Meteor.publish('Cart-deviceOrders', function(deviceId) {
	// TODO: validate params with simple-schema

	if(deviceId){
		return Cart.Items.find({deviceId});
	}

	return this.ready();
});
