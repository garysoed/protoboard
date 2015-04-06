/**
 * To use this library, you will need to write an HTML file. You will need to do the following:
 * 1. Add the following code to the `<head>` block of the document:
 *    ```html
 *    <link rel="import" href="path/to/protoboard/out/main.html">
 *    ```
 * 2. Add custom elements in the body. Be sure to import the appropriate files in the `<head>`
 *    block. For example, to add a token:
 *    ```html
 *    <head>
 *      <!-- Required -->
 *      <link rel="import" href="path/to/out/di.html">
 *      <link rel="import" href="path/to/out/bootstrap.html">
 *
 *      <!-- Import token -->
 *      <link rel="import" href="path/to/out/component/token.html">
 *
 *      <!-- This should always come last -->
 *      <link rel="import" href="path/to/protoboard/out/main.html">
 *    </head>
 *
 *    <body>
 *      <pb-c-token>
 *        <div>Token Content</div>
 *      </pb-c-token>
 *
 *      <script>
 *        // Required
 *        DI.run(['pb.=', function(Bootstrap) { Bootstrap.run(document); }]);
 *      </script>
 *    </body>
 *    ```
 *    Make sure that all dependencies are ABOVE the `main.html` import.
 *
 * To help with debugging for missing imports, you can open the developer tools (Alt + &#8984; for
 * Chrome on Mac) and check the Console tab. It should tell you elements which are missing imports.
 * For instance `Element pb-r-bag is resolved` indicates that the import for `bag.html` is missing.
 *
 * More information on using the element is in the API pages. You can also see
 * [all/index.html](https://github.com/garysoed/protoboard/blob/master/ex/all/index.html) for
 * examples on how to use every element. You can also play around with every element on that page.
 *
 * Some example projects:
 * - [Chess](https://github.com/garysoed/protoboard-chess)
 *
 * @class 3 Basic Usage
 * @module tutorial
 */