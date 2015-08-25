/**
 * Protoboard has a built in platform for triggering abilities. Every interaction with a Protoboard
 * component will trigger an ability.
 *
 * All abilities can be found under the `ability` directory. Every ability extends from the
 * {{#crossLink "ability.Ability"}}{{/crossLink}} class. Extending this class provides the following
 * features:
 * - Reacts to changes to configuration attribute(s) of this ability.
 * - Hook into the {{#crossLink "data.LogService"}}Logging service{{/crossLink}}
 * - Customizable trigger
 *
 * Every instance of an ability has a default configuration. When an element created, the ability
 * will check for any configuration attributes it knows, and apply any default configuration to the
 * element. Note that since the same instance of an ability is shared across multiple elements, you
 * should never store element specific state in an ability. Instead, use
 * {{#crossLink Symbol}}{{/crossLink}} to decorate the element with the state.
 *
 * Every ability is associated with a {{#crossLink "trigger.Trigger"}}Trigger{{/crossLink}}. A
 * trigger listens to events in the browser, and, if the event happens, triggers the ability. To
 * implement your own ability, implement the {{#crossLink ability.Ability}}{{/crossLink}} class.
 * Note that most of the time, you will only need to implement the
 * {{#crossLink "ability.Ability/doTrigger:method"}}doTrigger{{/crossLink}} method.
 *
 * Every ability on an element can be customized by changing an attribute related to that ability.
 * These attributes are prefixed with `name-`, where `name` is the name of the ability. For example,
 * the `drop-on` attribute specifies the trigger for the `drop` ability. Hence, the following sets
 * the `drop` ability to be triggered when the user clicks on the deck:
 *
 * ```html
 * <pb-r-deck drop-on="click"></pb-r-deck>
 * ```
 *
 * The `-on` configuration can be found on every ability, and they all sets the ability's trigger.
 * If you want to add a configuration, you will need to implement the
 * {{#crossLink "ability.Ability/init:method"}}init{{/crossLink}} method to set the default value of
 * the configuration on the element.
 *
 * Now that you have your custom ability, you can add it to an element using the
 * {{#crossLink "data.ConfigService"}}{{/crossLink}}. For example:
 *
 * ```javascript
 * Protoboard.forNewGame().setup(function(require) {
 *   var Config = require('data.ConfigService');
 *   Config.add('pb-c-card', new CustomAbility());
 * });
 * ```
 * The example above adds the CustomAbility to all `pb-c-card` elements.
 *
 * @class 08 Abilities
 * @module tutorial
 */
