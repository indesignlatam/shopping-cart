Cart.subscriptionHandles = {
	userOrders: Meteor.subscribe("Cart-userOrders")
};

Tracker.autorun(function(){
	if(!Session.equals('Cart-deviceId', undefined)){
		Cart.subscriptionHandles.deviceOrders = Meteor.subscribe("Cart-deviceOrders", Session.get('Cart-deviceId'));
	}
});

Tracker.autorun(function(){
	if(!Meteor.userId() && Session.equals('Cart-deviceId', undefined)){
		let deviceId = amplify.store("Cart-deviceId");
		if(!deviceId){
			deviceId = Random.id();
			amplify.store("Cart-deviceId", deviceId);
		}
		Session.set('Cart-deviceId', deviceId);
	}else if(Meteor.userId()){
		Cart.Items.find({
			userId: {$exists: false},
			deviceId: Session.get('Cart-deviceId')
		},{fields:{userId: 1,deviceId: 1}}).forEach(function(order){
			Cart.Items.update({
				_id: order._id
			},{
				$set:{userId: Meteor.userId()},
				$unset:{deviceId: 1}
			},function(error){
				if(error){
					console.log(error);
				}
			});
		});
		Session.set('Cart-deviceId', undefined);
	}
});

Session.setDefault('Cart-itemCount', 0);
Session.setDefault('Cart-itemTotal', 0);

Tracker.autorun(function(){
	let query = {};
	if(Meteor.userId()){
		query.userId = Meteor.userId();
	}else{
		query.deviceId = Session.get('Cart-deviceId');
	}
	
	let total = 0;
	const items = Cart.Items.find(query, {fields: {price: 1, amount: 1}});
	items.forEach(function(item){
		total += item.price * item.amount;
	});
	
	Session.set('Cart-itemTotal', Math.floor(total*100)/100);
	Session.set('Cart-itemCount', items.count());
});



