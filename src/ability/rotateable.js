import Check from 'src/check';
import Utils from 'src/utils';

import Ability from 'src/ability/ability';

/**
 * Makes the component rotateable. This adds a transform rotateZ CSS rule to the component.
 * @class ability.Rotateable
 * @extends ability.Ability
 */

const ATTR_NAME = 'pb-rotateable';
const ATTR_INDEX = 'pb-orientation-index';

// Private symbols.
const __defaultIndex__ = Symbol();
const __defaultOrientations__ = Symbol();
const __getOrientations__ = Symbol();
const __getOrientationIndex__ = Symbol();
const __setOrientationIndex__ = Symbol('setOrientationIndex');

export default class Rotateable extends Ability {

  [__getOrientations__](el) {
    return $(el).attr(ATTR_NAME).split(' ')
        .map(str => Check(str).isInt().orUse(undefined))
        .filter(value => Number.isInteger(value));
  }

  [__getOrientationIndex__](el) {
    return Check($(el).attr(ATTR_INDEX)).isInt().orThrows();
  }

  /**
   * Sets the orientation index of the given element to the given value. This only updates
   * the pb-orientation-index attribute value.
   *
   * @method  __setOrientationIndex__
   * @param {!Element} el The Element to set the orientation index of.
   * @param {number} index The orientation index to set to
   * @private
   */
  [__setOrientationIndex__](el, index) {
    let orientations = this[__getOrientations__](el);
    if (orientations.length > 0) {
      if (index < 0) {
        index = -(-index % orientations.length);
        index += orientations.length;
      } 

      if (index >= orientations.length) {
        index %= orientations.length;
      }

      $(el).attr(ATTR_INDEX, index);
    }
  }

  /**
   * @constructor
   * @param {Array.<number>} defaultOrientations Array of default orientations, in degrees.
   * @param {number} defaultIndex The index of the default orientation.
   */
  constructor(defaultOrientations = [0], defaultIndex = 0) {
    this[__defaultIndex__] = defaultIndex;
    this[__defaultOrientations__] = defaultOrientations.join(' ');
  }

  /**
   * Sets the default value of the given element.
   *
   * @method setDefaultValue
   * @param {!Element} el The element whose default value should be set.
   */
  setDefaultValue(el) {
    if ($(el).attr(ATTR_NAME) === undefined || $(el).attr(ATTR_NAME) === 'true') {
      $(el).attr(ATTR_NAME, this[__defaultOrientations__]);
    }

    if ($(el).attr(ATTR_INDEX) === undefined) {
      $(el).attr(ATTR_INDEX, this[__defaultIndex__]);
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
    if (name === ATTR_NAME) {
      // Refreshes the orientation index.
      this[__setOrientationIndex__](el, this[__getOrientationIndex__](el));
    }

    if (name === ATTR_INDEX) {
      let orientation = this[__getOrientations__](el)[Check(newValue).isInt().orThrows()];
      el.style.transform = `rotateZ(${orientation}deg)`;
    }
  }

  /**
   * Change the orientation of the element.
   *
   * @method trigger
   * @param {!Element} el The element to trigger the ability on.
   */
  trigger(el) {
    this[__setOrientationIndex__](el, this[__getOrientationIndex__](el) + 1);
  }

  /**
   * The name of the ability.
   * 
   * @attribute name
   * @type string
   */
  get name() {
    return ATTR_NAME;
  }
}

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.ability.Rotateable', Rotateable);
}