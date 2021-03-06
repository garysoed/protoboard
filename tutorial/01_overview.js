/**
 * Protoboard is a library to make prototyping boardgames easier. This is meant to be used for
 * prototyping ideas and is therefore focused on ease and flexibility of creating different game
 * components. Aesthetics, performance, and correctness are outside the scope of this project,
 * though we do provide some basic support for theming.
 *
 * This aims to be customizable in different levels:
 * 1. JavaScript: Provides JavaScript API to make boardgame components easier (coming soon)
 * 2. HTML: Developers can use preexisting HTML elements to write their own game.
 * 3. {{#crossLink "5 Theming"}}Theme{{/crossLink}}: This library comes with some existing themes. You
 * can customize the color themes, and if you use CSS, you can customize in greater details.
 *
 * Some glossary of terminologies for the API:
 * {{#html 'dl'}}
 *   {{#html 'dt'}}{{#crossLink "ability.Ability"}}Ability{{/crossLink}}{{/html}}
 *   {{#html 'dd'}}These are where the main logic happens. A Component can have several abilities,
 *   each triggered with a Trigger.{{/html}}
 *
 *   {{#html 'dt'}}{{#crossLink "component.Component"}}Component{{/crossLink}}{{/html}}
 *   {{#html 'dd'}}Components are the basic entity of a board. They provide main interaction with
 *   the players. Every component has one or more abilities registered to it. Check the
 *   {{#crossLink "component.Component"}}API reference{{/crossLink}} to see the ability names
 *   registered to a component.{{/html}}
 *
 *   {{#html 'dt'}}{{#crossLink "region.Region"}}Region{{/crossLink}}{{/html}}
 *   {{#html 'dd'}}Regions can contain other components. They cannot be moved and can contain one or
 *   more components. Examples include: deck, bag, and hand.{{/html}}
 *
 *   {{#html 'dt'}}{{#crossLink "trigger.Trigger"}}Trigger{{/crossLink}}{{/html}}
 *   {{#html 'dd'}}Triggers listen to events in the document and triggers the ability it is
 *   associated with. The most common trigger that this library relies on by default is the
 *   {{#crossLink "trigger.Key"}}Key{{/crossLink}} trigger. To trigger a component, point at the
 *   component and press the appropriate key.{{/html}}
 *
 *   {{#html 'dt'}}UI{{/html}}
 *   {{#html 'dd'}}This library also comes with several basic UI elements for convenience. These
 *   elements do not have a real life counterpart.{{/html}}
 * {{/html}}
 *
 * Every element introduced in Protoboard has 3 parts of its name:
 * 1. `pb-` is the prefix of every Protoboard element.
 * 2. The second prefix indicates the type of element:
 *    - `pb-c-` indicates a component
 *    - `pb-r-` indicates a region
 *    - `pb-u-` indicates a UI element.
 * 3. The last part is the name of the element.
 *
 * @class 1 Overview
 * @module tutorial
 */
