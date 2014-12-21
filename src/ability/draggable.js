import Check from 'src/check';
import Utils from 'src/utils';

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
const _DEFAULT_VALUE = Symbol();
const _DRAG_START_HANDLER = Symbol();
const _DRAG_END_HANDLER = Symbol();

function handleDragEnd() {
  this.classList.remove(CLASS_DRAGGED);
}

function handleDragStart(event) {
  let dataTransfer = event.dataTransfer;
  dataTransfer.effectAllowed = 'move';
  this.classList.add(CLASS_DRAGGED);

  DragDropService.dragStart(this);
}

function register(element) {
  element[_DRAG_START_HANDLER] = handleDragStart.bind(element);
  element[_DRAG_END_HANDLER] = handleDragEnd.bind(element);

  // Propagate the draggable attribute to the root element.
  Utils.toArray(element.children).forEach(child => {
    $(child).attr('draggable', 'true');
    child.addEventListener('dragstart', element[_DRAG_START_HANDLER]);
    child.addEventListener('dragend', element[_DRAG_END_HANDLER]);
  });
}

function unregister(element) {
  Utils.toArray(element.children).forEach(child => {
    child.removeEventListener('dragend', element[_DRAG_END_HANDLER]);
    child.removeEventListener('dragstart', element[_DRAG_START_HANDLER]);
    $(child).attr('draggable', null);
  });
}

export default class Draggable extends Ability {

  constructor(defaultValue) {
    this[_DEFAULT_VALUE] = defaultValue;
  }

  /**
   * Sets the default value of the given element.
   *
   * @method setDefaultValue
   * @param {!Element} el The element whose default value should be set.
   */
  setDefaultValue(el) {
    if ($(el).attr(ATTR_NAME) === undefined) {
      $(el).attr(ATTR_NAME, this[_DEFAULT_VALUE]);
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
        register(el);
      } else {
        unregister(el);
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
      register(el);
    }
  }

  /**
   * Handles unregistration when the element is detached from the document.
   *
   * @method detachedCallback
   * @param {!Element} el The element that was detached.
   */
  detachedCallback(el) {
    unregister(el);
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
