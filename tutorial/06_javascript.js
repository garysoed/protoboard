/**
 * Protoboard exposes JavaScript API that you can use to customize your board game prototype. Some
 * services, such as the {{#crossLink "service.Log"}}Log Service{{/crossLink}}, requires you to call
 * the JavaScript API.
 *
 * In order to access the API, you will to import the file containing the JavaScript you want to
 * use.
 *
 * All of the JavaScript API is only accessible from within the Protoboard environment. You can
 * access them from the {{#crossLink "Protoboard.Runner/setup:method"}}setup method{{/crossLink}}
 * and the Promise returned by the
 * {{#crossLink "Protoboard.Runner/run:method"}}run method{{/crossLink}}:
 *
 * ```javascript
 * Protoboard
 *     .forNewGame(2, {})
 *     .setup(function(require) {
 *       // Access the log service here.
 *       require('pb.service.Log').log('event', 'setting up');
 *     })
 *     .run(document)
 *     .then(function(require) {
 *       // You can also access the log service here.
 *       require('pb.service.Log').log('event', 'running');
 *     });
 * ```
 *
 * Protoboard however, only allows one call of the run method to be called. Since `main.html`
 * already does this, you cannot import this file if you want to access Protoboard environment.
 * `main.html` is responsible for bootstraping the app, and without it, you will need to do this
 * yourself. The full bootstrapping process can be seen below:
 *
 * ```javascript
 * Protoboard
 *     .forNewGame(2, {})                  // 1. Creates a new game.
 *     .join('player1', { role: 'Medic' }) // 2. Adds players to the game
 *     .setup(function(require) { })       // 3. Setup logic goes here.
 *     .run(document)                      // 4. Runs the bootstrap logic.
 *     .then(function(require) { });       // 5. Do some post bootstrap logic.
 * ```
 *
 * Protoboard's startup process happens in five stages:
 *
 * 1.  First, Protoboard needs to know if the game it is running is an existing game, or a new game.
 *     This becomes important in {{#crossLink "10 Networked Games"}}Networking{{/crossLink}} mode.
 *     At this point, Protoboard figures out how many players are needed to start a game.
 * 1.  Protoboard then adds any local players to the game. It will then wait until there are
 *     enough players for the game to start.
 * 1.  Once there are enough players to start a game, Protoboard runs the setup logic. Logic that
 *     sets up Components, Regions, UIs, and other custom elements should be done here.
 * 1.  Protoboard then runs the bootstrap logic. At this point, all templates and custom elements
 *     are resolved.
 * 1.  Finally, Protoboard runs post bootstrap logic. Any logic that requires the Protoboard
 *     elements, such as listening to event emitted by the components, shuffling a deck, and getting
 *     references to DOM elements, should happen here.
 *
 * If you don't care about having multiple players, you can omit the arguments to `forNewGame`:
 *
 * ```javascript
 * Protoboard
 *     .forNewGame()
 *     .setup(function(require) { })
 *     .run(document)
 *     .then(function(require) { });
 * ```
 *
 * If you don't care about the setup logic, you can call the
 * {{#crossLink "Protoboard/run:method"}}{{/crossLink}} method:
 *
 * ```javascript
 * Protoboard
 *     .run(document)
 *     .then(function(require) { });
 * ```
 *
 * @since 3.1.0
 * @class 06 JavaScript
 * @module tutorial
 */
