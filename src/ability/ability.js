import Utils from 'src/utils';

/**
 * Base class for all abilities. Any abilities must extend this class and implement the methods
 * in this class.
 *
 * @class ability.Ability
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
   * @param {Object} oldValue The old value of the attribute.
   * @param {Object} newValue The new value of the attribute.
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

  /**
   * Triggers the effect of the ability on the given element.
   *
   * @method trigger
   * @param {!Element} el The element to trigger the ability on.
   */
  trigger(el) { }

  /**
   * The name of the ability. This is used as an ID to refer to the registered abilities.
   * 
   * @property name
   * @type string
   * @readonly
   */
  get name() { throw 'unimplemented'; }
}

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.ability.Ability', Ability);
}
