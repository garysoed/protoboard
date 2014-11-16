var Utils = {
  /**
   * Extracts the given template from the given document.
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
   * @param {!Object} object Object to observe changes to.
   * @param {string|null} property The property name to listen to, or null to listen to all 
   *     properties.
   * @param {Function} handler Handler called when a property has changed. The handler accepts 3
   *     arguments: property name, change type, and the old value of the property.
   */
  observe(object, property, handler) {
    Object.observe(object, function(changes) {
      changes.forEach(change => {
        if (!property || change.name === property) {
          handler(change.name, change.type, change.oldValue);
        }
      });
    });
  },

  waitFor(object, property, truth, handler) {
    let truthFn = (typeof truth === 'function') 
        ? truth 
        : v => v === truth;
    if (truthFn(object[property])) {
      handler();
    } else {
      let observer = (changes) => {
        if (truthFn(object[property])) {
          Object.unobserve(object, observer)
          handler();
        }
      }
      Object.observe(object, observer);
    }
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
   * @param {string} The namespace of the target. This should be separated by '.'.
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
          currentScope[path] = {}
        }
      }
      currentScope = currentScope[path];
    });
  }
};

export default Utils = Utils;

Utils.makeGlobal('pb.Utils', Utils);
