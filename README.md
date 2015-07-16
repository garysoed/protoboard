# protoboard

[![Circle CI](https://img.shields.io/circleci/project/garysoed/protoboard/master.svg?style=flat-square)](https://img.shields.io/circleci/project/garysoed/protoboard/master.svg?style=flat-square)

Library to easily prototype board games. Check [here](https://garysoed.github.com/protoboard) for
full documentation, or [here](https://garysoed.github.com/protoboard-demo/index.html) for demo of
supported components.

Interested in contributing? Read the guideline [here](./CONTRIBUTING.md).

## Release notes
These are the release notes for the most current major version. For older release notes, go to the
[Releases page](https://github.com/garysoed/protoboard/releases).

### 1.2.1
- Changed `service.Log.defaultPrinter` to not print anything if the phase is `before`.
- `service.Move` now fires a `move` event. You can use JQuery to listen to the event.

### 1.2.0
Improvements
- Added `nextElement` to service.Move to return the last added element. All Droppable abilities now
drop the last picked element first.
- Bootstrap.run now returns a promise that will be resolved when the registration is complete.
- Abilities now log before and after they are triggered. You can differentiate the two calls by
examining the value of `phase`.
- Added tutorial on creating custom elements.

### 1.1.0
Improvements
- Abilities now emit DOM events when triggered
- Deprecated service.Log#addProcessor. Processing log has been split to two stages: preprocessing
and printing.
- Fixed documentation of [Abilities](http://garysoed.github.io/protoboard/classes/ability.Abilities.html)
- Ability's default trigger is now optional.

Breaking changes
- Moved ability.Abilities API to invoke trigger. Instead of calling
`Abilities.of(el).trigger('abilityName')`, call `Abilities.trigger(el, 'abilityName')`.

### 1.0.0
First stable release

New
- Added support for adding custom triggers
- Added tutorials on JavaScript and Trigger

Improvements
- Added gulp task to test each test in individual browser
- Reduced the wait interval for Utils.watch.

Bug Fixes
- Fixed bug where Helpable service test registers Move service twice (#88)
- Added missing Ability dependency to Droppable (#87)
