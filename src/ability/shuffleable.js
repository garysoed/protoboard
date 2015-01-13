import Check from 'src/check';
import Utils from 'src/utils';

import Ability from 'src/ability/ability';

/**
 * Provides decorator to make the component be able to shuffle the child elements.
 * 
 * @class ability.Shuffleable
 * @extends ability.Ability
 */

/**
 * Set to true to enable this element to be shuffleable.
 *
 * @attribute pb-shuffleable
 */
const ATTR_NAME = 'pb-shuffleable';

// Private symbols.
const __defaultEnabled__ = Symbol();

export default class Shuffleable extends Ability {

  /**
   * @constructor
   * @param {boolean=} defaultEnabled True iff this ability should be enabled by default. Defaults
   *     to true.
   */
  constructor(defaultEnabled = true) {
    this[__defaultEnabled__] = defaultEnabled;
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
  }

  /**
   * Shuffles the children of the given element.
   *
   * @method trigger
   * @param {!Element} el The element whose children should be shuffled.
   */
  trigger(el) {
    if (Check($(el).attr(ATTR_NAME)).isBoolean().orThrows()) {
      let pairs = Utils.toArray(el.children).map(child => [child, Math.random()]);
      pairs.sort((a, b) => Utils.compare(a[1], b[1]));

      let shuffled = pairs.map(pair => pair[0]);
      shuffled.forEach(shuffledEl => el.appendChild(shuffledEl));
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

Utils.makeGlobal('pb.ability.Shuffleable', Shuffleable);