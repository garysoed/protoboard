/**
 * Base class for all abilities.
 *
 * @class ability.Ability
 * @static
 */
export default class Ability {

  /**
   * Sets the default value of the given element.
   *
   * @method setDefaultValue
   * @param {!Element} el The element whose default value should be set.
   */
  setDefaultValue(el) { }

  /**
   * Called when an attribute was changed.
   *
   * @method attributeChangedCallback
   * @param {!Element} el The element whose attribute was changed.
   * @param {string} name The name of the attribute that was changed.
   * @param {Object=} oldValue The old value of the attribute.
   * @param {Object=} newValue The new value of the attribute.
   */
  attributeChangedCallback(el, name, oldValue, newValue) { }

  /**
   * Called when the element is attached to the document.
   *
   * @method attachedCallback
   * @param {!Element} el The element that was attached.
   */
  attachedCallback(el) { }

  /**
   * Called when the element is detached from the document.
   *
   * @method detachedCallback
   * @param {!Element} el The element that was detached.
   */
  detachedCallback(el) { }
};
