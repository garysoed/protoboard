# Contributing
There are many ways to contribute to Protoboard.

## Bug Fixes / Feature Implementation
Protoboard uses the following technologies:
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) - This is used to
  create custom elements as well as dependency management through HTML imports.
- ES6 - All JavaScript code is written in ES6, compiled using [Babel](https://babeljs.io/).
- CSS variable - This is used for theming. Protoboard uses [Myth](http://www.myth.io/) to compile
  CSS variables.
- Karma - This is used to run unit tests.
- [YUIDoc](http://yui.github.io/yuidoc/) - Used for writing documentations and tutorials.

Important directories:
- `src` - Contains all source files.
- `test` - Contains all test files. They have to be suffixed with `_test`.
- `out` - This is the output directory of the compiled source and test files. Clients integrating
  with Protoboard will access this directory.
- `tutorial` - Contains tutorials written in YUIDoc.
- `themes` - Theme files that come with Protoboard.
- `dist` - zip file containing files to be distributed outside Bower

Run `gulp karma-dev` to start a karma server that listens to changes to files and execute the unit
tests whenever they are changed. To run the tests once, run `gulp check`.

If you want to work on an issue, search for issues with the `_ready` label and assign it to
yourself.

## File Issues
Go [here](https://github.com/garysoed/protoboard/issues) to file bugs, request for features or
tutorials or additional documentation. You don't need to add any labels or milestones when filing
issues.

## Write Tutorials
Tutorials are written in YUIDoc. You can find examples of them in `tutorial` directory.

## Write Example Apps
File an issue if you have an example app that you want showcased on the page. These apps will be
useful for other developers to learn using Protoboard.
