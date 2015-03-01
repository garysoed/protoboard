YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "1 Overview",
        "2 Prerequisites",
        "3 Basic Usage",
        "4 Customizing Components",
        "Check",
        "DI.BindingTree",
        "DI.Provider",
        "DI.Scope",
        "Events",
        "Events.Action",
        "HammerWrapper",
        "PbElement",
        "Utils",
        "ability.Abilities",
        "ability.Abilities.Builder",
        "ability.Ability",
        "ability.Droppable",
        "ability.Helpable",
        "ability.Pickable",
        "ability.Shuffleable",
        "ability.Toggleable",
        "component.Card",
        "component.Component",
        "component.Token",
        "region.Bag",
        "region.Bag.RandomPickable",
        "region.Deck",
        "region.Hand",
        "region.Hand.ReorderableDroppable",
        "region.Rect",
        "region.Rect.FlexDroppable",
        "region.Region",
        "service.Move",
        "service.Preview",
        "service.Registry",
        "surface.RectGrid",
        "trigger.Click",
        "trigger.DoubleClick",
        "trigger.Key",
        "trigger.Key.Service",
        "trigger.Trigger",
        "ui.Preview",
        "ui.Previewer",
        "ui.Template"
    ],
    "modules": [
        "api",
        "tutorial"
    ],
    "allModules": [
        {
            "displayName": "api",
            "name": "api"
        },
        {
            "displayName": "tutorial",
            "name": "tutorial",
            "description": "Protoboard is a library to make prototyping boardgames easier. This is meant to be used for\nprototyping ideas and is therefore focused on ease and flexibility of creating different game\ncomponents. Aesthetics, performance, and correctness are outside the scope of this project,\nthough we do provide some basic support for theming.\n\nThis aims to be customizable in different levels:\n1. JavaScript: Provides JavaScript API to make boardgame components easier (coming soon)\n2. HTML: Developers can use preexisting HTML elements to write their own game.\n3. Themes: This library comes with some existing themes. You can customize the color themes, and\n   if you use CSS, you can customize in greater details (coming next).\n\nSome glossary of terminologies for the API:\n<dl>\n  <dt>{{#crossLink \"ability.Ability\"}}Ability{{/crossLink}}</dt>\n  <dd>These are where the main logic happens. A Component can have several abilities, each\n  triggered with a Trigger.</dd>\n\n  <dt>{{#crossLink \"component.Component\"}}Component{{/crossLink}}</dt>\n  <dd>Components are the basic entity of a board. They provide main interaction with the players.\n  Every component has one or more abilities registered to it. Check the\n  {{#crossLink \"component.Component\"}}API reference{{/crossLink}} to see the ability names\n  registered to a component.</dd>\n\n  <dt>{{#crossLink \"region.Region\"}}Region{{/crossLink}}</dt>\n  <dd>Regions can contain other components. They cannot be moved and can contain one or more\n  components. Examples include: deck, bag, and hand.</dd>\n\n  <dt>{{#crossLink \"trigger.Trigger\"}}Trigger{{/crossLink}}</dt>\n  <dd>Triggers listen to events in the document and triggers the ability it is associated with.\n  The most common trigger that this library relies on by default is the\n  {{#crossLink \"trigger.Key\"}}Key{{/crossLink}} trigger. To trigger a component, point at the\n  component and press the appropriate key.</dd>\n\n  <dt>UI</dt>\n  <dd>This library also comes with several basic UI elements for convenience. These elements do\n  not have a real life counterpart.</dd>\n</dl>\n\nEvery element introduced in Protoboard has 3 parts of its name:\n1. `pb-` is the prefix of every Protoboard element.\n2. The second prefix indicates the type of element:\n  - `pb-c-` indicates a component\n  - `pb-r-` indicates a region\n  - `pb-u-` indicates a UI element.\n3. The last part is the name of the element."
        }
    ]
} };
});