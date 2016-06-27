/*global Package:true*/

Package.describe({
	name: 'indesign:shopping-cart',
	version: '0.0.5',
	summary: 'A simple shopping cart Barebones with all basic features. Fork of Meteor Cart',
	git: 'https://github.com/wanchopeblanco/shopping-cart.git',
	documentation: 'README.md'
});

Package.onUse(function(api) {
	api.versionsFrom('1.3');

	api.use([
		'tracker',
		'reactive-var',
		'amplify@1.0.0'
	], 'client');

	api.use([
		'mongo',
		'random',
		'underscore',
		'ecmascript',
		'accounts-base',
		'aldeed:simple-schema@1.5.3',
		'aldeed:collection2@2.9.1'
	], ['server','client']);


	api.mainModule('client/index.js', 'client');
	api.mainModule('server/index.js', 'server');
});
