Package.describe({
    name: 'wanchopeblanco:shopping-cart',
    version: '0.0.1',
    summary: 'A simple shopping cart with all basic features, Fork of Meteor Cart with some adittions (Removed Stripe)',
    git: '',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom("METEOR@0.9.0");

    api.use([
        'tracker@1.0.3',
        'templating',
        'session',
        'amplify'
        ]
      , 'client');

    api.use([
        'mongo@1.0.8', 'underscore', 'accounts-base', 'random'
        ], ['server','client']);

    api.add_files(['lib/both/environment.js'], ['client','server']);
    api.add_files(['lib/client/cart.html','lib/client/cart.js'], 'client');
    api.add_files(['lib/server/publications.js'], 'server');

    api.export('Cart', ['client','server']);
});