/**
 * All elements in Protoboard are made out of
 * [HTML Custom Element](http://www.html5rocks.com/en/tutorials/webcomponents/customelements/) with
 * some {{#crossLink "ability.Ability"}}Abilities{{/crossLink}} attached to them. The custom element
 * handles the rendering logic, while the abilities handles user interaction.
 *
 * All custom elements should extend the {{#crossLink "PbElement"}}{{/crossLink}}. This class
 * automatically assigns a unique ID to the element, which will be used for logging and to uniquely
 * identify an element. If you are making a custom Component, you should extend
 * {{#crossLink "component.Component"}}{{/crossLink}}. Likewise, if you are making a custom Region,
 * you should extend {{#crossLink "region.Region"}}{{/crossLink}}.
 *
 * After creating the custom element, you need to add abilities to it. To do this, use the Config
 * service's {{#crossLink "service.Config/add:method"}}add{{/crossLink}} method. For example:
 *
 * ```javascript
 * Protoboard
 *     .setup(function(require) {
 *       var Config = require('pb.service.Config');
 *       var Pickable = require('pb.ability.Pickable');
 *
 *       Config.add('custom-element', new Pickable());
 *     });
 * ```
 *
 * This adds the {{#crossLink "ability.Pickable"}}{{/crossLink}} ability to the custom element with
 * name `custom-element`.
 *
 * You will also need to make Protoboard recognizes the new element. To do this, inject a
 * `pb.$registry` instance and call its
 * {{#crossLink "service.Registry/add:method"}}add{{/crossLink}} method:
 *
 * ```javascript
 * Protoboard.setup(function(require) {
 *   var $registry = require('pb.$registry');
 *   $registry.add('custom-element', CustomElement);
 * });
 * ```
 *
 * Note that you need to do all of the above before calling
 * {{#crossLink "Bootstrap/run:method"}}{{/crossLink}}.
 *
 * @class 7 Custom Elements
 * @module tutorial
 */
