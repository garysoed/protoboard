import Check  from 'src/check';
import Events from 'src/events';
import Utils  from 'src/utils';

import Ability from 'src/ability/ability';

import DragDrop from 'src/service/dragdrop';

/**
 * Provides decorator to make an element be a drop target for drag and drop.
 * 
 * @class ability.Droppable
 * @static
 * @extends ability.Ability
 */

const ATTR_NAME = 'pb-droppable';
const CLASS_OVER = 'pb-over';

// Private symbols.
const __defaultValue__ = Symbol();
const __dragEnterCount__ = Symbol();
const __observeHandler__ = Symbol();
const __onDragOver__ = Symbol();
const __onDragEnter__ = Symbol('onDragEnter');
const __onDragLeave__ = Symbol();
const __onLastDraggedElChange__ = Symbol();
const __register__ = Symbol('register');
const __unregister__ = Symbol('unregister');

export default class Droppable extends Ability {

  constructor(defaultValue) {
    this[__defaultValue__] = defaultValue;
    this[__dragEnterCount__] = 0;
  }

  [__onDragOver__](el, event) {
    event.preventDefault();
    event.dropEffect = 'move';
  }

  [__onDragEnter__](el) {
    el.classList.add(CLASS_OVER);
    this[__dragEnterCount__]++;
  }

  [__onDragLeave__](el, event) {
    this[__dragEnterCount__]--;
    if (this[__dragEnterCount__] <= 0) {
      this[__dragEnterCount__] = 0;
      el.classList.remove(CLASS_OVER);
    }
  }

  [__onLastDraggedElChange__](el) {
    if (!DragDrop.lastDraggedEl) {
      this[__dragEnterCount__] = 0;
      el.classList.remove(CLASS_OVER);
    }
  }

  [__register__](el) {
    Events.of(el, this)
        .register('dragover', this[__onDragOver__].bind(this, el))
        .register('dragenter', this[__onDragEnter__].bind(this, el))
        .register('dragleave', this[__onDragLeave__].bind(this, el))
        .register('drop', this.trigger.bind(this, el));

    $(DragDrop).on(
        DragDrop.Events.LAST_DRAGGED_EL_CHANGED, 
        this[__onLastDraggedElChange__].bind(this, el));
  }

  [__unregister__](el) {
    // TODO(gs): off the last dragged el changed

    Events.of(el, this).unregister();
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
  Utils.makeGlobal('pb.ability.Droppable', Droppable);
}