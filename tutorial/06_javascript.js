/**
 * Protoboard exposes JavaScript API that you can use to customize your board game prototype. Some
 * services, such as the {{#crossLink "service.Log"}}Log Service{{/crossLink}}, requires you to call
 * the JavaScript API.
 *
 * In order to access the API, you will to import the file containing the JavaScript you want to
 * use.
 *
 * All of the JavaScript API is only accessible from within the Protoboard environment. You can
 * access them from the {{#crossLink "Protoboard/setup:method"}}{{/crossLink}} and the
 * {{#crossLink "Protoboard/run:method"}}{{/crossLink}}:
 *
 * ```javascript
 * Protoboard.setup(function(require) {
 *   require('pb.service.Log').log('category', 'value');
 * });
 * ```
 *
 * Protoboard however, only allows one call of `Protoboard.run` to be called. Since `main.html`
 * already does this, you cannot import this file. `main.html` is responsible for bootstraping
 * the app, and without it, you will need to do this yourself. Bootstrapping the app is done calling
 * the {{#crossLink "Protoboard/run:method"}}{{/crossLink}}. For example:
 *
 * ```javascript
 * Protoboard
 *     .setup(function(require) {
 *       // Setup logic goes here
 *     })
 *     .run(document)
 *     .then(function(require) {
 *       // Logic that runs after the game is running goes here.
 *     });
 * ```
 *
 * All logic that requires the Protoboard elements, such as listening to event emitted by the
 * components, shuffling a deck, and getting references to DOM elements, should happen after the
 * bootstrap. Any other logic should happen before the bootstrap logic.
 *
 * @class 6 JavaScript
 * @module tutorial
 */
