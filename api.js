YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "1 Overview",
        "2 Prerequisites",
        "3 Basic Usage",
        "4 Customizing Components",
        "5 Theming",
        "Check",
        "Hammer",
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
        "component.Dice",
        "component.Dice.DiceFlippable",
        "component.Dice.Rollable",
        "component.Token",
        "region.Bag",
        "region.Bag.RandomPickable",
        "region.CubeTower",
        "region.CubeTower.TowerDroppable",
        "region.Deck",
        "region.Hand",
        "region.Hand.ReorderableDroppable",
        "region.Rect",
        "region.Rect.FlexDroppable",
        "region.Region",
        "service.Acl",
        "service.Acl.Group",
        "service.Config",
        "service.Log",
        "service.Move",
        "service.Preview",
        "service.Registry",
        "service.State",
        "service.Template",
        "surface.Grid",
        "surface.HexGrid",
        "surface.RectGrid",
        "surface.TriangleGrid",
        "trigger.Click",
        "trigger.DoubleClick",
        "trigger.Key",
        "trigger.Key.Service",
        "trigger.Trigger",
        "ui.Generate",
        "ui.Preview",
        "ui.Previewer",
        "ui.Shape"
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
            "description": "Protoboard is a library to make prototyping boardgames easier. This is meant to be used for\nprototyping ideas and is therefore focused on ease and flexibility of creating different game\ncomponents. Aesthetics, performance, and correctness are outside the scope of this project,\nthough we do provide some basic support for theming.\n\nThis aims to be customizable in different levels:\n1. JavaScript: Provides JavaScript API to make boardgame components easier (coming soon)\n2. HTML: Developers can use preexisting HTML elements to write their own game.\n3. {{#crossLink \"5 Theming\"}}Theme{{/crossLink}}: This library comes with some existing themes. You\ncan customize the color themes, and if you use CSS, you can customize in greater details.\n\nSome glossary of terminologies for the API:\n{{#html 'dl'}}\n  {{#html 'dt'}}{{#crossLink \"ability.Ability\"}}Ability{{/crossLink}}{{/html}}\n  {{#html 'dd'}}These are where the main logic happens. A Component can have several abilities,\n  each triggered with a Trigger.{{/html}}\n\n  {{#html 'dt'}}{{#crossLink \"component.Component\"}}Component{{/crossLink}}{{/html}}\n  {{#html 'dd'}}Components are the basic entity of a board. They provide main interaction with\n  the players. Every component has one or more abilities registered to it. Check the\n  {{#crossLink \"component.Component\"}}API reference{{/crossLink}} to see the ability names\n  registered to a component.{{/html}}\n\n  {{#html 'dt'}}{{#crossLink \"region.Region\"}}Region{{/crossLink}}{{/html}}\n  {{#html 'dd'}}Regions can contain other components. They cannot be moved and can contain one or\n  more components. Examples include: deck, bag, and hand.{{/html}}\n\n  {{#html 'dt'}}{{#crossLink \"trigger.Trigger\"}}Trigger{{/crossLink}}{{/html}}\n  {{#html 'dd'}}Triggers listen to events in the document and triggers the ability it is\n  associated with. The most common trigger that this library relies on by default is the\n  {{#crossLink \"trigger.Key\"}}Key{{/crossLink}} trigger. To trigger a component, point at the\n  component and press the appropriate key.{{/html}}\n\n  {{#html 'dt'}}UI{{/html}}\n  {{#html 'dd'}}This library also comes with several basic UI elements for convenience. These\n  elements do not have a real life counterpart.{{/html}}\n{{/html}}\n\nEvery element introduced in Protoboard has 3 parts of its name:\n1. `pb-` is the prefix of every Protoboard element.\n2. The second prefix indicates the type of element:\n   - `pb-c-` indicates a component\n   - `pb-r-` indicates a region\n   - `pb-u-` indicates a UI element.\n3. The last part is the name of the element."
        }
    ]
} };
});