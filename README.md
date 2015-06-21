# protoboard

[![Circle CI](https://img.shields.io/circleci/project/garysoed/protoboard/master.svg?style=flat-square)](https://img.shields.io/circleci/project/garysoed/protoboard/master.svg?style=flat-square)

Library to easily prototype board games. Check [here](https://garysoed.github.com/protoboard) for
full documentation, or [here](https://garysoed.github.com/protoboard-demo/index.html) for demo of
supported components.

Interested in contributing? Read the guideline [here](./CONTRIBUTING.md).

## Release notes
### 0.3.3
- Fixed gulp script.

### 0.3.2
- Fixed bug where minimized files do not depend on minimized dependencies.
- Minimized files have been moved from `out/` to `min/`. Their names no longer have the `.min.html`
suffix.

### 0.3.1
New
- Added [tutorial](http://garysoed.github.io/protoboard/classes/6%20Abilities.html) on Abilities.

Breaking changes
- Renamed surface to grid. All grid elements' prefix are renamed from `pb-s-` to `pb-g-`.

Improvements
- Added Circle CI integration
- Migrated to Gulp 4.0
- Added minified HTML. These files have `.min.html` suffix.
- Exposed a promise on every PbElement that will be resolved when an element has finished rendering.
- Node names are now exposed as static property `NODE_NAME`. You can now refer to the node names
from JavaScript.
- Extracted abilities hidden in component and region classes. You can now use abilities used by
`pb-r-bag`, `pb-r-dicetower`, `pb-r-hand`, and `pb-r-rect`.

Bug Fixes
- Improved performance when dragging element (#80)
- Added missing dependency. (#78)
- Fixed bug where the counter location for pb-r-rect is at the wrong location (#77)

### 0.3.0
New
- `pb-state` element to keep the runtime state of the game.
- Added counters for regions. Now you can see how many cards are in a deck, etc.
- `pb-cube-tower`
- ACL Service used to control.

Breaking changes
- Removed `pb-` prefix from default ability names.
- Changed `pb-c-card` faces to use `pb-front` and `pb-back` attributes instead of `pb-front` and
`pb-back` classes.
- Changed grids to use `row` and `col` attributes for the row and column counts, instead of `pb-row`
 and `pb-col`.

Improvements
- Some code cleanup.
- Config service now allows you to set the trigger of all abilities with the same name.
- Abilities can now be triggered through JavaScript, using the
[Abilities](http://garysoed.github.io/protoboard/classes/ability.Abilities.html) class.

Bug Fixes
- Added `box-sizing: border-box` to various components. This fixed a lot of the sizing. (#70)
- Fixed bug where the `pb-bag` outline is not visible. (#69)
- Fixed bug where drop shadow doesn't appear

### 0.2.2
New
- Contributing guide

Bug Fixes
- Disabled abilities are shown in Helpable's overlap (#60)
- Hammer events do not work (#64)
- `pb-c-card` outline on hover is not at the top (#59)

### 0.2.0
New
- Theming support
- `<pb-c-dice>` element
- Grid elements: `<pb-s-hexgrid>`, `<pb-s-trianglegrid>`
- Simple shapes element `<pb-u-shape>`
- Example [Chess](https://github.com/garysoed/protoboard-chess) game
- Published on Bower
- Logger API

Improvements
- Improvements to `<pb-s-rectgrid>`
- Reworked `<pb-u-template>` element. Cleaned up the interface to pass in helpers and variables.
- Code cleanup

### 0.1.0
- Initial release: establishing basic use case and philosophy
