import Check from 'src/check';
import Utils from 'src/utils';

import Ability from 'src/ability/ability';

/**
 * Provides decorator to make an element toggleable between two states.
 * 
 * @class ability.Toggleable
 * @extends ability.Ability
 */

/**
 * Set to true to make this element toggleable.
 * 
 * @attribute pb-toggleable
 */
const ATTR_NAME = 'pb-toggleable';

/**
 * Set to true to show the front side of the element, however front is defined.
 *
 * @attribute pb-showfront
 */
const ATTR_SHOWFRONT = 'pb-showfront';

// Private symbols.
const __defaultEnabled__ = Symbol();
const __defaultShowFront__ = Symbol();

const __isEnabled__ = Symbol();
const __isShowFront__ = Symbol();

export default class Toggleable extends Ability {

  /**
   * @constructor
   * @param {boolean} defaultEnabled True iff the element registered to this ability will have
   *     this ability enabled by default.
   * @param {boolean} defaultShowFront True iff the element registered to this ability will
   *     show the front side by default.
   */
  constructor(defaultEnabled = true, defaultShowFront = false) {
    this[__defaultEnabled__] = defaultEnabled;
    this[__defaultShowFront__] = defaultShowFront;
  }

  /**
   * @method __isEnabled__
   * @param {!Element} el Element to check.
   * @return {boolean} True iff the ability is enabled for the given element.
   * @private
   */
  [__isEnabled__](el) {
    return Check($(el).attr(ATTR_NAME)).isBoolean().orThrows();
  }

  /**
   * @method __isShowFront__
   * @param {!Element} el Element to check.
   * @return {boolean} True iff the element is currently showing the "front" side.
   * @private
   */
  [__isShowFront__](el) {
    return Check($(el).attr(ATTR_SHOWFRONT)).isBoolean().orThrows();
  }

  /**
   * Sets the default value of the given element.
   *
   * @method setDefaultValue
   * @param {!Element} el The element whose default value should be set.
   */
  setDefaultValue(el) {
    if ($(el).attr(ATTR_NAME) === undefined) {
      $(el).attr(ATTR_NAME, this[__defaultEnabled__]);
    }

    if ($(el).attr(ATTR_SHOWFRONT) === undefined) {
      $(el).attr(ATTR_SHOWFRONT, this[__defaultShowFront__]);
    }
  }

  /**
   * Toggles the state of the element.
   *
   * @method trigger
   * @param  {!Element} el Element to toggle the state of.
   */
  trigger(el) {
    if (this[__isEnabled__](el)) {
      $(el).attr(ATTR_SHOWFRONT, !this[__isShowFront__](el));
    }
  }

  /**
   * The name of the ability. This is used as an ID to refer to the registered abilities.
   * 
   * @property name
   * @type string
   * @readonly
   */
  get name() {
    return ATTR_NAME;
  }
}

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.ability.Toggleable', Toggleable);
}