Cart
===========

A simple shopping cart package for meteor.js


------

## Install
```js
meteor add indesign:shopping-cart
````

Exports `Cart` object

Creates a collection that is accessible at `Cart.Items`

Cart.Items must have a `price` field


Session vars that are set for you

`cart-itemCount` Shows the total amount of products in cart

`cart-itemTotal` Shows the total price of the cart


Amplify is used to generate a deviceId (in session as `cart-deviceId`)

If there is no logged in user, the items added to the cart are attached to the device, if there is a logged in user, the items are attached to the user

If items are added to the cart as a non-logged in user, then the user logs in, the items are moved from the device to the user

eg:
not logged in: 
```js
{item.deviceId: "XXXX"}
```

logged in:
```js
{item.userId: "XXXX"}
```

## Adding items to cart
```js
Template.productsView.events({
    'click .add-to-cart'(event){
        event.preventDefault();

        let item  = {};
        let query = {};

        if(!Meteor.userId()){
            item.deviceId   = Session.get('Cart-deviceId');
            query.deviceId  = Session.get('Cart-deviceId');
        }else{
            item.userId     = Meteor.userId();
            query.userId    = Meteor.userId();
        }

        // Set Product ID
        item.productId  = this._id;
        query.productId = this._id;
        
        item.price      = this.price;

        const existingItem = Cart.Items.findOne(query, {fields: {amount:1, _id:1, "product.title":1}});

        let amount = 0;
        if(existingItem){
            amount = existingItem.amount++;
            
            Cart.Items.update({_id: existingItem._id}, {$set: {
                amount: amount
            }});
            return;
        }
        
        amount++;
        item.amount = amount;

        Cart.Items.insert(item);
    }
});
```

## Removing item from cart
```js
Template.productsView.events({
	'click .remove.one.cart'(event){
		event.preventDefault();
	
		let query = {};
	        if(!Meteor.userId()){
	            query.deviceId = Session.get('Cart-deviceId');
	        }else{
	            query.userId = Meteor.userId();
	        }
	        // Set Product ID
	        query.productId = this._id;
	
	        const existingItem = Cart.Items.findOne(query, {fields: {amount: 1, _id: 1}});
	        
	        if(existingItem){
	            let amount = existingItem.amount;
	            // If items have no more to substract, delete it
	            if(amount <= 1){
	                Cart.Items.remove({_id: existingItem._id});
	                return;
	            }
	
	            amount--;
	            
	            Cart.Items.update({_id: existingItem._id}, {$set: {
	                amount:amount
	            }});
	        }
	},
}
```






