/**
 * Beside abilities, Protoboard also allows you to create your own Triggers. Triggers are the main
 * way for Abilities to be executed. Examples of Triggers include the
 * {{#crossLink "trigger.Click"}}Click{{/crossLink}} trigger, which triggers an ability on an
 * element when the user clicks that element.
 *
 * To create a trigger, you need to implement the {{#crossLink "trigger.Trigger"}}{{/crossLink}}
 * class. You will then need to register a parser with the
 * {{#crossLink "trigger.Triggers"}}{{/crossLink}} service, by calling the
 * {{#crossLink "trigger.Triggers/register:method"}}register{{/crossLink}} method. For example:
 *
 * ```javascript
 * DIJS.run(function(require) {
 *   var Events = require('Events');
 *   var Trigger = require('trigger.Trigger');
 *   var Triggers = require('trigger.Triggers');
 *
 *   var OnMouseUpTrigger = function() {};
 *   OnMouseUpTrigger.prototype = Object.create(Trigger.prototype);
 *
 *   OnMouseUpTrigger.prototype.on = function(element, ability) {
 *     Events.of(element, this)
 *         .on('dom', 'mouseup', ability.trigger.bind(ability, element));
 *   };
 *
 *   OnMouseUpTrigger.prototype.off = function(element) {
 *   	 Events.of(element, this).off('dom', 'mouseup');
 *   };
 *
 *   OnMouseUpTrigger.prototype.toString = function() {
 *     return 'mouseup';
 *   };
 *
 *   OnMouseUpTrigger.prototype.helpText = 'Triggers when mouse is unpressed on the element';
 *
 *   Triggers.register(function(string) {
 *     return (string === 'mouseup') ? new OnMouseUpTrigger() : undefined;
 *   });
 * });
 * ```
 *
 * The {{#crossLink "Events"}}{{/crossLink}} class is a utility class to make event registering and
 * unregistering easier to manage.
 *
 * @class 9 Triggers
 * @since 1.0.0
 * @module tutorial
 */
