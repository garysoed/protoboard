/**
 * Protoboard is a library to make prototyping boardgames easier. This is meant to be used for
 * prototyping ideas and is therefore focused on ease and flexibility of creating different game
 * components. Aesthetics, performance, and correctness are outside the scope of this project,
 * though we do provide some basic support for theming.
 *
 * This aims to be customizable in different levels:
 * 1. JavaScript: Provides JavaScript API to make boardgame components easier (coming soon)
 * 2. HTML: Developers can use preexisting HTML elements to write their own game.
 * 3. Themes: This library comes with some existing themes. You can customize the color themes, and
 *    if you use CSS, you can customize in greater details (coming next).
 *
 * Some glossary of terminologies for the API:
 * <dl>
 *   <dt>{{#crossLink "ability.Ability"}}Ability{{/crossLink}}</dt>
 *   <dd>These are where the main logic happens. A Component can have several abilities, each
 *   triggered with a Trigger.</dd>
 *
 *   <dt>{{#crossLink "component.Component"}}Component{{/crossLink}}</dt>
 *   <dd>Components are the basic entity of a board. They provide main interaction with the players.
 *   Every component has one or more abilities registered to it. Check the
 *   {{#crossLink "component.Component"}}API reference{{/crossLink}} to see the ability names
 *   registered to a component.</dd>
 *
 *   <dt>{{#crossLink "region.Region"}}Region{{/crossLink}}</dt>
 *   <dd>Regions can contain other components. They cannot be moved and can contain one or more
 *   components. Examples include: deck, bag, and hand.</dd>
 *
 *   <dt>{{#crossLink "trigger.Trigger"}}Trigger{{/crossLink}}</dt>
 *   <dd>Triggers listen to events in the document and triggers the ability it is associated with.
 *   The most common trigger that this library relies on by default is the
 *   {{#crossLink "trigger.Key"}}Key{{/crossLink}} trigger. To trigger a component, point at the
 *   component and press the appropriate key.</dd>
 *
 *   <dt>UI</dt>
 *   <dd>This library also comes with several basic UI elements for convenience. These elements do
 *   not have a real life counterpart.</dd>
 * </dl>
 *
 * Every element introduced in Protoboard has 3 parts of its name:
 * 1. `pb-` is the prefix of every Protoboard element.
 * 2. The second prefix indicates the type of element:
 *   - `pb-c-` indicates a component
 *   - `pb-r-` indicates a region
 *   - `pb-u-` indicates a UI element.
 * 3. The last part is the name of the element.
 *
 * @class 1 Overview
 * @module tutorial
 */

/**
 * Some examples of abilities include:
 *   <ul>
 *     <li>{{#crossLink "ability.Shuffleable"}}Shuffleable{{/crossLink}}: Shuffles the component's
 *     children when triggered.
 *     <li> {{#crossLink "ability.Pickable"}}Pickable{{/crossLink}}: Makes the component's move
 *     following the mouse, until dropped.
 *     <li>{{#crossLink "ability.Droppable"}}Droppable{{/crossLink}}: Adds the picked component as
 *     the current component's child.
 *   </ul>
 *
 *   Each Ability attached to a Component has its own name. This means that you can have two
 *   abilities of the same type, but different names. For example, {{#crossLink "component.Card"}}
 *   pb-c-card{{/crossLink}} has two abilities: `flippable` and `tappable`, both of which are of
 *   type {{#crossLink "ability.Toggleable"}}Toggleable{{/crossLink}}.
 */