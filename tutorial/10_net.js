/**
 * Protoboard allows you to have a networked game. To make a game networked, you will neeed to
 * modify the first two stages discussed in the
 * {{#crossLink "06 JavaScript"}}JavaScript tutorial{{/crossLink}}.
 *
 * steps are involved in creating a networked game:
 *
 * 1.  Decide on the communication protocol between clients.
 * 1.  Setup the game.
 * 1.  Add player(s) to the game.
 *
 * For deciding client - client communication protocol, you will need to create an object that
 * implements the {{#crossLink "net.AbstractIO"}}{{/crossLink}}. Pass this object to Protoboard
 * using the {{#crossLink "Protoboard/withIo:method"}}{{/crossLink}}:
 *
 * ```javascript
 * Protoboard.withIo(newIoObject)
 * ```
 *
 * Protoboard comes with some built in implementations of AbstractIO:
 *
 * -   {{#crossLink "net.InMemoryIO"}}{{/crossLink}} - this stores data in memory. Use this if you
 *     don't care about communicating between two tabs.
 * -   {{#crossLink "net.LocalStorageIO"}}{{/crossLink}} - this stores data in local storage. Use
 *     this if you want to play games between two tabs, but in the same browser.
 * -   {{#crossLink "net.FirebaseIO"}}{{/crossLink}} - this stores data in FireBase. Use this if
 *     you want to play networked games.
 *
 * For the next step, you will need to decide if you want to create a new game, or to join an
 * existing game. Use the `forNewGame` to create a new game, or `forExistingGame` to use an
 * existing game. For example, to join an existing game:
 *
 * ```javascript
 * Protoboard
 *     .withIo(newIoObject)
 *     .forExistingGame('gameId')
 * ```
 *
 * If you decide to create a new game, you will need to decide on the number of players needed to
 * start the game and the initial state of the game.
 *
 * The final step will be to add local players to the game using the
 * {{#crossLink "Protoboard.Runner/join:method"}}join{{/crossLink}} method:
 *
 * ```javascript
 * Protoboard
 *     .withIo(newIoObject)
 *     .forExistingGame('gameId')
 *     .join('player2', { role: 'Medic' })
 * ```
 *
 * After this step, Protoboard will wait until there are enough players joining the game. Once there
 * are enough number of players, it will run the rest of the startup process.
 *
 * Note that Protoboard will make the game state available to the
 * {{#crossLink "ui.TemplateService"}}TemplateService{{/crossLink}}. Look at the documentation of
 * {{#crossLink "Protoboard.Runner/run:method"}}{{/crossLink}} for this.
 *
 * @class 10 Networked Games
 * @since 3.1.0
 * @module tutorial
 */
