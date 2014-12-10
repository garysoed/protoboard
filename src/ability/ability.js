/**
 * Base class for all abilities.
 *
 * @class ability.Ability
 * @static
 */
const Ability = {

  /**
   * Sets the default value of the ability.
   *
   * @method setDefaultValue
   * @param {!Object} defaultValue The default value of the ability.
   */
  setDefaultValue(defaultValue) { },

  /**
   * Called when an attribute was changed.
   *
   * @method attributeChangedCallback
   * @param {string} name The name of the attribute that was changed.
   * @param {Object=} oldValue The old value of the attribute.
   * @param {Object=} newValue The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) { },

  /**
   * Called when the element is attached to the document.
   *
   * @method attachedCallback
   */
  attachedCallback() { },

  /**
   * Called when the element is detached from the document.
   *
   * @method detachedCallback
   */
  detachedCallback() { }
};

export default Ability;
