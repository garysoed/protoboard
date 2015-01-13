import Check  from 'src/check';
import Events from 'src/events';
import Utils  from 'src/utils';

import Ability from 'src/ability/ability';

import DragDrop from 'src/service/dragdrop';

/**
 * Provides decorator to make an element be a drop target for drag and drop.
 * 
 * @class ability.Droppable
 * @extends ability.Ability
 */

/**
 * Set to true to make it possible to drop elements into this element.
 * @attribute pb-droppable
 */
const ATTR_NAME = 'pb-droppable';
const CLASS_OVER = 'pb-over';

// Private symbols.
const __defaultValue__ = Symbol();
const __dragEnterCount__ = Symbol();

const __onDragEnter__ = Symbol('onDragEnter');
const __onDragLeave__ = Symbol();
const __onDragOver__ = Symbol();
const __onLastDraggedElChange__ = Symbol('onLastDraggedElChange');
const __register__ = Symbol('register');
const __unregister__ = Symbol('unregister');

export default class Droppable extends Ability {

  /**
   * @constructor
   * @param {boolean} defaultValue True iff the ability should be enabled.
   */
  constructor(defaultValue) {
    this[__defaultValue__] = defaultValue;
    this[__dragEnterCount__] = 0;
  }

  /**
   * Handler called when an element has entered the given element.
   *
   * @method __onDragEnter__
   * @param {!Element} el The element that is being entered.
   * @private
   */
  [__onDragEnter__](el) {
    el.classList.add(CLASS_OVER);
    this[__dragEnterCount__]++;
  }

  /**
   * Handler called when an element has left the given element.
   * 
   * @method __onDragLeave__
   * @param {!Element} el The element being left behind.
   * @private
   */
  [__onDragLeave__](el) {
    this[__dragEnterCount__]--;
    if (this[__dragEnterCount__] <= 0) {
      this[__dragEnterCount__] = 0;
      el.classList.remove(CLASS_OVER);
    }
  }

  /**
   * Handler called when an element is dragged over the given element.
   *
   * @method __onDragOver__
   * @param {!Element} el The element where another element is dragged over it.
   * @param {!Event} event The event object.
   * @private
   */
  [__onDragOver__](el, event) {
    event.preventDefault();
    event.dropEffect = 'move';
  }

  /**
   * Handler called when the last element being dragged has changed.
   *
   * @method __onLastDraggedElChange__
   * @param {!Element} el The element that this ability is registered to.
   * @private
   */
  [__onLastDraggedElChange__](el) {
    if (!DragDrop.lastDraggedEl) {
      this[__dragEnterCount__] = 0;
      el.classList.remove(CLASS_OVER);
    }
  }

  /**
   * Registers the handlers for this ability to the given element.
   *
   * @method __register__
   * @param {!Element} el The element to register the ability to.
   * @private
   */
  [__register__](el) {
    Events.of(el, this)
        .listen('dragover', this[__onDragOver__].bind(this, el))
        .listen('dragenter', this[__onDragEnter__].bind(this, el))
        .listen('dragleave', this[__onDragLeave__].bind(this, el))
        .listen('drop', this.trigger.bind(this, el));

    Events.of(DragDrop, this)
        .on(
            DragDrop.Events.LAST_DRAGGED_EL_CHANGED, 
            this[__onLastDraggedElChange__].bind(this, el));
  }

  [__unregister__](el) {
    Events.of(el, this).unlisten();
    Events.of(DragDrop, this).off();
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
   * Drop the last dragged element on the given element
   *
   * @method trigger
   * @param {!Element} el The element to drop the dragged element into.
   * @param {!Event} event Event object that triggered the call.
   */
  trigger(el, event) {
    el.classList.remove(CLASS_OVER);

    let lastDraggedEl = DragDrop.lastDraggedEl;
    if (lastDraggedEl) {
      el.appendChild(lastDraggedEl);

      // TODO(gs): attached callback doesn't seem to be called on appendChild.
      // https://github.com/webcomponents/webcomponentsjs/issues/18
      if (DragDrop.lastDraggedEl.attachedCallback) {
        DragDrop.lastDraggedEl.attachedCallback();
      }
    }
    DragDrop.dragEnd();
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
  Utils.makeGlobal('pb.ability.Droppable', Droppable);
}