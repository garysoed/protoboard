/**
 * To set up a networked game, you will need to do the following:
 *
 * 1. Decide on the communication protocol between the client and server.
 * 2. Setup the initial game state.
 * 3. Provides an interface to create or join game.
 *
 * ```
 * Protoboard
 *     .setup(function(require) {
 *       var SessionService = require('pb.net.Session');
 *       return SessionService
 *           .create(2)
 *           .then(function(gameSync) {
 *             console.log('Game ID ' + gameSync.id + ' created.');
 *
 *             // Initialize the game state here
 *
 *             return SessionService.join(gameSync, 'Gary', { 'class': 'Mage' });
 *           });
 *     })
 *     .run(document);
 * ```
 *
 * @class 10 Networked Games
 * @since 3.1.0
 * @module tutorial
 */
