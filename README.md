# protoboard

[![Circle CI](https://img.shields.io/circleci/project/garysoed/protoboard/0.3.1.svg?style=flat-square)](https://img.shields.io/circleci/project/garysoed/protoboard/0.3.1.svg?style=flat-square)

Library to easily prototype board games. Check [here](https://garysoed.github.com/protoboard) for
full documentation, or [here](https://garysoed.github.com/protoboard-demo/index.html) for demo of
supported components.

Interested in contributing? Read the guideline [here](./CONTRIBUTING.md).

## Release notes
### 0.3.0
New
- `pb-state` element to keep the runtime state of the game.
- Added counters for regions. Now you can see how many cards are in a deck, etc.
- `pb-cube-tower`
- ACL Service used to control.

Breaking changes
- Removed `pb-` prefix from default ability names.
- Changed `pb-card` faces to use `pb-front` and `pb-back` attributes instead of `pb-card` and
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
