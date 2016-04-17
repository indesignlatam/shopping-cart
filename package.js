Package.describe({
    name: 'indesign:shopping-cart',
    version: '0.0.3',
    summary: 'A simple shopping cart Barebones with all basic features. Fork of Meteor Cart',
    git: 'https://github.com/wanchopeblanco/shopping-cart.git',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom("METEOR@0.9.0");

    api.use([
        'tracker@1.0.3',
        'session',
        'amplify'
        ]
      , 'client');

    api.use([
        'mongo@1.0.8', 'underscore', 'accounts-base', 'random'
        ], ['server','client']);

    api.add_files(['lib/both/environment.js'], ['client','server']);
    api.add_files(['lib/client/cart.js'], 'client');
    api.add_files(['lib/server/publications.js'], 'server');

    api.export('Cart', ['client','server']);
});