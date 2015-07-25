# protoboard

[![Circle CI](https://img.shields.io/circleci/project/garysoed/protoboard/master.svg?style=flat-square)](https://img.shields.io/circleci/project/garysoed/protoboard/master.svg?style=flat-square)

Library to easily prototype board games. Check [here](https://garysoed.github.com/protoboard) for
full documentation, or [here](https://garysoed.github.com/protoboard-demo/index.html) for demo of
supported components.

Interested in contributing? Read the guideline [here](./CONTRIBUTING.md).

## Release notes

These are the release notes for the most current major version. For older release notes, go to the
[Releases page](https://github.com/garysoed/protoboard/releases).

### 2.0.1

Bug fixes
-   Made `TEST_MODE` in `ability.Abilities` be optional.
-   Updated `di-js` to `v3.0.1`, which contains bug fix

### 2.0.0

Breaking changes
-   Updated to `di-js 3.0.0`. This changes the interface to inject values. See the tutorial for
    this.
-   Removed deprecated properties
    -   `service.Log.addProcessor`
    -   `service.Log.defaultProcessor`
    -   `ability.Abilities.Builder.trigger`
