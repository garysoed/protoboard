import As    from 'src/as';
import Utils from 'src/utils';

import Ability from 'src/ability/Ability';

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
const _DEFAULT_ENABLED = Symbol();
const _DEFAULT_SHOWFRONT = Symbol();
const _DEFAULT_TRIGGER = Symbol();
const _TRIGGER = Symbol();
const _TRIGGER_HANDLER = Symbol();

function getEvent(trigger) {
  switch (trigger) {
    case 'pb-click':
      return 'click';
    case 'pb-dblclick':
      return 'doubleclick';
    default:
      throw 'Unrecognized trigger: ' + trigger;
  }
}

function handleTrigger(el) {
  $(el).attr(ATTR_SHOWFRONT, !isShowFront(el));
}

function register(el) {
  el[_TRIGGER_HANDLER] = handleTrigger.bind(this, el);

  // Get the trigger event
  // TODO: Handle multiple triggers.
  // TODO: Move to trigger class.
  // TODO: Use hammerjs
  // TODO: Make register and unregister can be called many times
  for (let trigger of ['pb-click', 'pb-dblclick']) {
    if ($(el).attr(trigger) === ATTR_NAME) {
      el[_TRIGGER] = trigger;
    }
  }

  el.addEventListener(getEvent(el[_TRIGGER]), el[_TRIGGER_HANDLER]);
}

function unregister(el) {
  el.removeEventListener(getEvent(el[_TRIGGER]), el[_TRIGGER_HANDLER]);
}

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

  // TODO: Move the triggers to some common place.
  constructor(defaultEnabled = true, defaultShowFront = 'false', defaultTrigger = 'pb-click') {
    this[_DEFAULT_ENABLED] = defaultEnabled;
    this[_DEFAULT_SHOWFRONT] = defaultShowFront;
    this[_DEFAULT_TRIGGER] = defaultTrigger;
  }

  /**
   * Sets the default value of the given element.
   *
   * @method setDefaultValue
   * @param {!Element} el The element whose default value should be set.
   */
  setDefaultValue(el) {
    if ($(el).attr(ATTR_NAME) === undefined) {
      $(el).attr(ATTR_NAME, this[_DEFAULT_ENABLED]);
    }

    if ($(el).attr(ATTR_SHOWFRONT) === undefined) {
      $(el).attr(ATTR_SHOWFRONT, this[_DEFAULT_SHOWFRONT]);
    }

    // TODO: Move to trigger
    let setTrigger = ['pb-click', 'pb-dblclick'].find(function(trigger) {
      return $(el).attr(trigger) === ATTR_NAME;
    });
    if (!setTrigger) {
      $(el).attr(this[_DEFAULT_TRIGGER], ATTR_NAME);
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
      newValue = As.boolean(newValue);
      if (newValue) {
        register(el);
      } else {
        unregister(el);
      }
    }

    // Handles triggers.
    if (['pb-click', 'pb-dblclick'].find(trigger => name === trigger)) {
      if (oldValue === ATTR_NAME) {
        unregister(el);
      }

      if (newValue === ATTR_NAME && isEnabled(el)) {
        unregister(el);
        register(el);
      }
    }
  }

  attachedCallback(el) {
    if ($(el).attr(ATTR_NAME) && isEnabled(el)) {
      register(el);
    }
  }

  detachedCallback(el) {
    unregister(el);
  }
}

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.ability.Toggleable', Toggleable);
}