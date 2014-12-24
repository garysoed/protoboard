import HammerWrapper from 'src/hammerwrapper';
import Utils         from 'src/utils';

import Ability from 'src/ability/ability';

/**
 * Provides triggers to abilities supported by the app. Normally you don't need to register this to
 * the app. [[ability.Abilities|ability.Abilities]] should do this for you.
 *
 * To use this class, add the trigger as an attribute name, and the name of the ability as its 
 * value.
 *
 * Supported triggers:
 * - `pb-click`: Triggers when the element is clicked.
 * - `pb-dblclick`: Triggers when the element is double clicked.
 * 
 * @class ability.Triggerable
 * @extends ability.Ability
 */

// Private symbols.
const __defaultValue__ = Symbol();
const __getEvent__ = Symbol('getEvent');
const __getTriggers__ = Symbol('getTriggers');
const __isRegistered__ = Symbol('isRegistered');
const __knownAbilities__ = Symbol();
const __register__ = Symbol('register');
const __triggers__ = Symbol();
const __unregister__ = Symbol('unregister');
const __handler__ = Symbol();

class Triggerable extends Ability {

  /**
   * Returns the event associated with the trigger type.
   * 
   * @method __getEvent__
   * @param {ability.Triggerable.TYPES} triggerType The type of trigger whose event should be 
   *     returned.
   * @return {string} The event related to the trigger type.
   * @private
   */
  [__getEvent__](triggerType) {
    switch (triggerType) {
      case Triggerable.TYPES.CLICK:
        return 'singletap';
      case Triggerable.TYPES.DOUBLE_CLICK:
        return 'doubletap';
      default:
        throw 'Unrecognized trigger: ' + triggerType;
    }
  }

  /**
   * Returns the triggers registered to the given element.
   * 
   * @method  __getTriggers__
   * @param {!Element} el The element to return the registered triggers from.
   * @return {Object} Object with key being the trigger type, and the value being the ability that
   *     is triggered by the key.
   * @private
   */
  [__getTriggers__](el) {
    if (!el[__triggers__]) {
      el[__triggers__] = {};
    }
    return el[__triggers__];
  }

  /**
   * Returns if the element is registered with the given ability.
   *
   * @method  __isRegistered__
   * @param {!Element} el The element to check.
   * @param {!ability.Triggerable.TYPES} triggerType The type of trigger to check.
   * @param {string} abilityName The name of ability to check.
   * @return {boolean} True iff the element is registered to trigger the given ability name on the
   *     given trigger type.
   * @private
   */
  [__isRegistered__](el, triggerType, abilityName) {
    if (!this[__getTriggers__](el)[triggerType]) {
      return false;
    }
    let ability = this[__getTriggers__](el)[triggerType].ability;
    return ability && abilityName === ability.name;
  }

  /**
   * Registers the given element to trigger the given ability.
   *
   * @method  __register__
   * @param {!Element} el The element to register.
   * @param {!ability.Triggerable.TYPES} triggerType The type of trigger to register.
   * @param {ability.Ability} ability The ability to register.
   * @private
   */
  [__register__](el, triggerType, ability) {
    if (!this[__isRegistered__](el, triggerType, ability.name)) {
      // Only registers if there aren't any triggers registered.
      let handlers = this[__getTriggers__](el);
      handlers[triggerType] = {ability: ability, handler: ability.trigger.bind(ability, el)};
      HammerWrapper.on(el, this[__getEvent__](triggerType), handlers[triggerType].handler);
    }
  }

  /**
   * Unregisters the given trigger type from the element.
   *
   * @method __unregister__
   * @param {!Element} el The element to unregister from.
   * @param {!ability.Triggerable.TYPES} triggerType The type of trigger to unregister.
   * @private
   */
  [__unregister__](el, triggerType) {
    let handlers = this[__getTriggers__](el);
    if (handlers[triggerType]) {
      HammerWrapper.off(el, this[__getEvent__](triggerType), handlers[triggerType].handler);
      delete handlers[triggerType];
    }
  }

  /**
   * @param {Object=} defaultValue An object with the triggerable type string as the key, and 
   *     the triggered ability's name as the value. These keys correspond to the element's 
   *     attributes. Defaults to empty object.
   * @param {Array.<ability.Ability>=} knownAbilities A list of known abilities. This is used 
   *     when the element's attribute value is changed. Defaults to empty array.
   * @constructor
   */
  constructor(defaultValue = {}, knownAbilities = []) {
    this[__defaultValue__] = defaultValue;
    this[__knownAbilities__] = {};
    for (let ability of knownAbilities) {
      this[__knownAbilities__][ability.name] = ability;
    }
  }

  /**
   * Sets the default value of the given element.
   *
   * @method setDefaultValue
   * @param {!Element} el The element whose default value should be set.
   */
  setDefaultValue(el) {
    for (let key in Triggerable.TYPES) {
      let type = Triggerable.TYPES[key]; 
      let abilityName = this[__defaultValue__][type];
      if ($(el).attr(type) === undefined && abilityName && this[__knownAbilities__][abilityName]) {
        $(el).attr(type, abilityName);
      }
    }
  }

  /**
   * Handles attribute change.
   *
   * @method attributeChangedCallback
   * @param {!Element} el The element whose attribute was changed.
   * @param {string} name Name of the attribute that was changed.
   * @param {string} oldValue Old value of the changed attribute.
   * @param {string} newValue New value of the changed attribute.
   */
  attributeChangedCallback(el, name, oldValue, newValue) {
    for (let key in Triggerable.TYPES) {
      if (name === Triggerable.TYPES[key]) {
        // Unregister the old ability.
        if (oldValue && this[__knownAbilities__][oldValue]) {
          this[__unregister__](el, name, this[__knownAbilities__][oldValue]);
        }

        if (newValue && this[__knownAbilities__][newValue]) {
          this[__register__](el, name, this[__knownAbilities__][newValue]);
        }
      }
    }
  }

  /**
   * Called when the element is attached to the document.
   *
   * @method attachedCallback
   * @param {!Element} el The element that was attached.
   */
  attachedCallback(el) {
    for (let key in Triggerable.TYPES) {
      let triggerType = Triggerable.TYPES[key];
      let abilityName = $(el).attr(triggerType);
      if (abilityName && this[__knownAbilities__][abilityName]) {
        this[__register__](el, triggerType, this[__knownAbilities__][abilityName]);
      }
    }
  }

  /**
   * Called when the element is detached from the document.
   *
   * @method detachedCallback
   * @param {!Element} el The element that was detached.
   */
  detachedCallback(el) {
    for (let key in Triggerable.TYPES) {
      this[__unregister__](el, Triggerable.TYPES[key]);
    }
  }
}

Triggerable.TYPES = {
  /**
   * Triggers when the element is clicked.
   *
   * @attribute pb-click
   */
  CLICK: 'pb-click',

  /**
   * Triggers when the element is double clicked.
   *
   * @attribute pb-dblclick
   */
  DOUBLE_CLICK: 'pb-dblclick'
};

export default Triggerable = Triggerable;

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.ability.Triggerable', Triggerable);
}
