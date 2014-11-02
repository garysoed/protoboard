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

  getContentElementRoot(el) {
    return el.querySelectorAll(':not(style):not(script)');
  }
};

export default Utils = Utils;

if (!window.pb) {
  window.pb = {};
}

window.pb.Utils = Utils;
