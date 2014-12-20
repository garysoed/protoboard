/**
 * Various miscellaneous utilities.
 * @class Utils
 * @static
 */

var Utils = {
  /**
   * Extracts the given template from the given document.
   * 
   * @method  extractTemplate
   * @param  {string} templateQuery The query used to obtain the template.
   * @param  {!Document} doc The document object to obtain the template from.
   * @return {!Node} The node in the template.
   */
  extractTemplate(templateQuery, doc) {
    return this.activateTemplate(doc.querySelector(templateQuery), doc);
  },

  activateTemplate(template, doc) {
    return doc.importNode(template.content, true);
  },

  /**
   * Returns the referenced function, or noop function if the referenced function does not exist.
   * 
   * @method  nonNullFn
   * @param  {!Object} scope Object containing the referenced function.
   * @param  {string} name Name of the function to return.
   * @return {!Function} The referenced function, or noop function if the referenced function does
   *     not exist.
   */
  nonNullFn(scope, name) {
    return scope[name] || (() => {});
  },

  /**
   * Observes the given property on the given object.
   * 
   * @method  observe
   * @param {!Object} object Object to observe changes to.
   * @param {string|null} property The property name to listen to, or null to listen to all 
   *     properties.
   * @param {Function} handler Handler called when a property has changed. The handler accepts 3
   *     arguments: property name, change type, and the old value of the property.
   *
   * @return {Function} The handler used to unobserve the object.
   */
  observe(object, property, handler) {
    var newHandler = function(changes) {
      changes.forEach(change => {
        if (!property || change.name === property) {
          handler(change.name, change.type, change.oldValue);
        }
      });
    };
    Object.observe(object, newHandler);
    return handler;
  },

  /**
   * Returns a Promise that waits for the given property of the given object to fulfill the given 
   * condition.
   *
   * @method waitFor
   * @param {!Object} object Object containing the property to wait for.
   * @param {string} property The name of the property to wait for.
   * @param {*} condition If Function, this method will call the function with the property value
   *     and will wait for the function to return true. Otherwise, this will wait for the property
   *     to match this.
   */
  waitFor(object, property, condition) {
    let promise = new Promise((resolve, reject) => {
      let truthFn = (typeof condition === 'function') ? 
          condition : v => v === condition;
      if (truthFn(object[property])) {
        resolve(object, property);
      } else {
        let observer = (changes) => {
          if (truthFn(object[property])) {
            Object.unobserve(object, observer);
            resolve(object, property);
          }
        };
        Object.observe(object, observer);
      }
    });

    return promise;
  },

  compare(a, b) {
    if (typeof a === 'number' && typeof b === 'number') {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    }

    return undefined;
  },

  toArray(obj) {
    let array = [];
    for (let i = 0; i < obj.length; i++) {
      array[i] = obj[i];
    }
    return array;
  },

  /**
   * Makes the given target to be globally available.
   *
   * @method makeGlobal
   * @param {string} namespace The namespace of the target. This should be separated by '.'.
   * @param {Object=} target The target object to be made globally available.
   */
  makeGlobal(namespace, target) {
    let currentScope = window;
    let pathArr = namespace.split('.');
    pathArr.forEach((path, i) => {
      if (i === (pathArr.length - 1)) {
        if (!currentScope[path]) {
          currentScope[path] = target;
        } else {
          throw `${namespace} already exists`; 
        }
      } else {
        if (!currentScope[path]) {
          currentScope[path] = {};
        }
      }
      currentScope = currentScope[path];
    });
  },

  /**
   * Replaces the specified function to call the given function before or after the original 
   * function. The given function will be called with the same arguments and scope as the original
   * function.
   *
   * @method extendFn
   * @param {Object} scope The object containing the function to replace.
   * @param {string} name The name of the function to replace.
   * @param {!Function} fn Function to be called.
   * @param {boolean} callBefore True iff the function should be called before the original 
   *     function. Defaults to false.
   */
  extendFn(scope, name, fn, callBefore) {
    let oldFn = scope[name];
    scope[name] = function() {
      if (callBefore) {
        let rv = fn.apply(this, arguments);
        if (!oldFn) {
          return rv;
        }
      }

      if (oldFn) {
        let rv = oldFn.apply(this, arguments);
        if (callBefore) {
          return rv;
        }
      }

      if (!callBefore) {
        return fn.apply(this, arguments);
      }
    };
  },

  /**
   * Makes the given function curried.
   *
   * @method curry
   * @param {!Function} fn The function to be curried.
   * @return {!Function} The curried function.
   */
  curry(fn) {
    return function() {
      if (arguments.length >= fn.length) {
        return fn.apply(this, arguments);
      } else {
        let argArray = Utils.toArray(arguments);
        return Utils.curry(fn.bind.apply(fn, [this].concat(argArray)));
      }
    };
  },

  // TODO: Move to test utils.
  getSymbol(obj, name) {
    return Object.getOwnPropertySymbols(obj).find(symbol => {
      return `Symbol(${name})` === symbol.toString();
    });
  }
};

export default Utils = Utils;

Utils.makeGlobal('pb.Utils', Utils);
