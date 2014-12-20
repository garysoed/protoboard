import As    from 'src/as';
import Utils from 'src/utils';

import Ability     from 'src/ability/ability';
import Triggerable from 'src/ability/triggerable';

/**
 * Set to true to make this element toggleable.
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

function isEnabled(el) {
  return As.boolean($(el).attr(ATTR_NAME));
}

function isShowFront(el) {
  return As.boolean($(el).attr(ATTR_SHOWFRONT));
}

/**
 * @class ability.Toggleable
 * @static
 * @extends ability.Ability
 */
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
    if (isEnabled(el)) {
      $(el).attr(ATTR_SHOWFRONT, !isShowFront(el));
    }
  }

  /**
   * @attribute name
   * @return {string} Name of the ability.
   */
  get name() {
    return ATTR_NAME;
  }
}

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.ability.Toggleable', Toggleable);
}