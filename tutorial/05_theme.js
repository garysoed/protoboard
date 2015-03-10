/**
 * Protoboard supports basic theming using
 * [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables). However,
 * since CSS variables is not widely supported, Protoboard relies on [Myth](http://www.myth.io/) to
 * compile the variables.
 *
 * You will need the source code. After running `npm install` in the source directory's root, you
 * can compile the CSS by running:
 * ```bash
 * gulp src
 * ```
 * To compile the source code, or:
 * ```bash
 * gulp ex
 * ```
 * To compile the source and example codes.
 *
 * The script reads from JSON files in the `./themes` directory. By default, they use the
 * `./themes/slateblue.json` theme. To change the colour theme to "medium sea green", you can run:
 * ```bash
 * gulp ex --theme ./themes/mediumseagreen.json
 * ```
 *
 * Though Protoboard comes with several themes, you can make your own theme. Create a json file with
 * two keys: `base` and `vars`:
 * ```json
 * {
 *   "base": "./themes/base.json"
 *   "vars": {
 *     "--color-lighter": "#CBC7E2",
 *     "--color-light": "#ABA5CF",
 *     "--color-normal": "#8982B8",
 *     "--color-dark": "#6B62A4",
 *     "--color-darker": "#50468F"
 *   }
 * }
 * ```
 *
 * The `vars` entry defines the colors used throughout the framework. You can see
 * `./themes/base.json` for additional variables to override. This include transition time, shadow
 * size, border size, etc.
 *
 * The `base` is a reference to another theme file. The path is relative to the location of the
 * `gulpfile.js` and should always start with `.` or `..`. The base theme file will be used for
 * variables that the framework uses but are not defined in your theme file. You can chain the
 * dependencies for multiple levels, but it is recommended to always depend on `./themes/base.json`
 * in the dependency chain, since new variables might be introduced, and might break your themes if
 * you did not set it in your theme file.
 *
 * @class 5 Theming
 * @since 0.2.0
 * @module tutorial
 */