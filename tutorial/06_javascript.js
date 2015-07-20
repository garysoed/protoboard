/**
 * Protoboard exposes JavaScript API that you can use to customize your board game prototype. Some
 * services, such as the {{#crossLink "service.Log"}}Log Service{{/crossLink}}, requires you to call
 * the JavaScript API.
 *
 * In order to access the API, you will to import the file containing the JavaScript you want to
 * use.
 *
 * Since all the JavaScript API is exposed within the [DI-JS](https://github.com/garysoed/di)
 * environment, you will need to import the `third_party/di.html` file. Accessing the DI-JS
 * environment can be done by calling its run method:
 *
 * ```javascript
 * DIJS.run(function(require) {
 *   require('pb.service.Log').log('category', 'value');
 * });
 * ```
 *
 * DI-JS, however, only allows one call of `DI.run` to be called. Since `main.html` already does
 * this, you cannot import this file. `main.html` is responsible for bootstraping the app, and you
 * will need to do this yourself. Bootstrapping the app is done using the
 * {{#crossLink "Bootstrap"}}{{/crossLink}} class. For example:
 *
 * ```javascript
 * DIJS.run(function(require) {
 *   // Setup logic goes here
 *
 *   // Build the app
 *   require('pb.Bootstrap').run(document);
 * });
 * ```
 *
 * All logic that requires the Protoboard elements, such as listening to event emitted by the
 * components, shuffling a deck, and getting references to DOM elements, should happen after the
 * bootstrap. Any other logic should happen before the bootstrap logic.
 *
 * @class 6 JavaScript
 * @module tutorial
 */
