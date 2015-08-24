/**
 * Protoboard supports basic theming using
 * [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables). However,
 * since CSS variables is not widely supported, Protoboard relies on [Myth](http://www.myth.io/) to
 * compile the variables.
 *
 * You will need the source code. If you installed protoboard as a bower package, you will find all
 * the files you need under `bower_components/protoboard`. Run `npm install` in the source
 * directory's root, and you can compile the source code by running:
 *
 * ```bash
 * gulp pack
 * ```
 *
 * The script reads from JSON files in the `./themes` directory. By default, they use the
 * `./themes/cloudy_day.json` theme. To change the colour theme to "strawberry", you can run:
 *
 * ```bash
 * gulp pack --theme ./themes/strawberry.json
 * ```
 *
 * Though Protoboard comes with several themes, you can make your own theme. Create a json file with
 * two keys: `base` and `vars`:
 *
 * ```json
 * {
 *   "base": "./bower_components/protoboard/themes/base.json"
 *   "vars": {
 *       "--color-primary": "#F44336",
 *       "--color-dark-primary": "#B71C1C",
 *       "--color-light-primary": "#FFCDD2",
 *       "--color-accent": "#FFD600"
 *   }
 * }
 * ```
 *
 * The `vars` entry defines the colors used throughout the framework. You can see
 * `./themes/base.json` for additional variables to override. This include transition time, shadow
 * size, border size, etc.
 *
 * The `base` is a reference to another theme file. The path is relative to the location of the
 * JSON file and should always start with `.` or `..`. The base theme file will be used for
 * variables that the framework uses but are not defined in your theme file. You can chain the
 * dependencies for multiple levels, but it is recommended to always depend on `./themes/base.json`
 * in the dependency chain, since new variables might be introduced, and might break your themes if
 * you did not set it in your theme file.
 *
 * If you want to use the theme in your own CSS file, require the `loadtheme` in your Node JS. This
 * is a function that accepts the file name of the theme JSON file.
 *
 * @class 05 Theming
 * @module tutorial
 */
