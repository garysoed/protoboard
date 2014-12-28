import Check  from 'src/check';
import Events from 'src/events';
import Utils  from 'src/utils';

import Ability         from 'src/ability/ability';
import DragDropService from 'src/service/dragdrop';

/**
 * Provides decorator to make an element draggable. Use [[Abilities|ability.Abilities]] to decorate
 * the element. Note that these methods should be called with the element to be decorated as the
 * scope.
 *
 * @class ability.Draggable
 * @static
 * @extends ability.Ability
 */

/**
 * Set to true to make this element draggable.
 * @attribute pb-draggable
 */
const ATTR_NAME = 'pb-draggable';

const CLASS_DRAGGED = 'pb-dragged';

// Private symbols.
const __defaultValue__ = Symbol();
const __onDragEnd__ = Symbol();
const __onDragStart__ = Symbol();
const __register__ = Symbol();
const __unregister__ = Symbol();

export default class Draggable extends Ability {

  /**
   * @constructor
   * @param  {boolean} defaultValue Default value of the element. True iff the element should be
   *     enabled by default.
   */
  constructor(defaultValue) {
    this[__defaultValue__] = defaultValue;
  }

  [__onDragEnd__](el) {
    el.classList.remove(CLASS_DRAGGED);
  }

  [__onDragStart__](el, event) {
    let dataTransfer = event.dataTransfer;
    dataTransfer.effectAllowed = 'move';
    el.classList.add(CLASS_DRAGGED);

    DragDropService.dragStart(this.getMovedElement(el));
  }

  [__register__](element) {
    // Propagate the draggable attribute to the root element.
    Utils.toArray(element.children).forEach(child => {
      $(child).attr('draggable', 'true');
      Events.of(child, this)
          .register('dragstart', this[__onDragStart__].bind(this, element))
          .register('dragend', this[__onDragEnd__].bind(this, element));
    });
  }

  [__unregister__](element) {
    Utils.toArray(element.children).forEach(child => {
      Events.of(child, this).unregister();
      $(child).attr('draggable', null);
    });
  }

  /**
   * Sets the default value of the given element.
   *
   * @method setDefaultValue
   * @param {!Element} el The element whose default value should be set.
   */
  setDefaultValue(el) {
    if ($(el).attr(ATTR_NAME) === undefined) {
      $(el).attr(ATTR_NAME, this[__defaultValue__]);
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
      newValue = Check(newValue).isBoolean(newValue).orThrows();
      if (newValue) {
        this[__register__](el);
      } else {
        this[__unregister__](el);
      }
    }
  }

  /**
   * Handles registration when the element is attached to the document.
   *
   * @method attachedCallback
   * @param {!Element} el The element that was attached.
   */
  attachedCallback(el) {
    if ($(el).attr(ATTR_NAME) && Check($(el).attr(ATTR_NAME)).isBoolean().orThrows()) {
      this[__register__](el);
    }
  }

  /**
   * Handles unregistration when the element is detached from the document.
   *
   * @method detachedCallback
   * @param {!Element} el The element that was detached.
   */
  detachedCallback(el) {
    this[__unregister__](el);
  }

  /**
   * Returns the element that will be moved, if the given element were to be dragged and dropped.
   *
   * @method  getMovedElement 
   * @param  {!Element} el The element that is dragged.
   * @return {!Element} The element that will be moved if the given element was dragged and dropped.
   */
  getMovedElement(el) {
    return el;
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
  Utils.makeGlobal('pb.ability.Draggable', Draggable);
}
