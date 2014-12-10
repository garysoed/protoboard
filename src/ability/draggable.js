import As from 'src/as';
import Utils from 'src/utils';
import Ability from 'src/ability/ability';
import DragDropService from 'src/service/dragdrop';

/**
 * Set to true to make this element draggable.
 * @attribute pb-draggable
 */
const ATTR_NAME = 'pb-draggable';

const CLASS_DRAGGED = 'pb-dragged';

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

/**
 * Provides decorator to make an element draggable. Use [[Abilities|ability.Abilities]] to decorate
 * the element. Note that these methods should be called with the element to be decorated as the
 * scope.
 *
 * @class Draggable
 * @static
 * @extends ability.Ability
 */
let Draggable = Object.create(Ability, {

  /**
   * Sets the default values for the element.
   *
   * @method setDefaultValue
   * @param {boolean} defaultValue Default value for pb-draggable attribute.
   */
  setDefaultValue: {
    value(defaultValue) {
      if ($(this).attr(ATTR_NAME) === undefined) {
        $(this).attr(ATTR_NAME, defaultValue);
      }
    }
  },

  /**
   * Handles attribute change.
   *
   * @method attributeChangedCallback
   * @param {string} name Name of the attribute that was changed.
   * @param {string} oldValue Old value of the changed attribute.
   * @param {string} newValue New value of the changed attribute.
   */
  attributeChangedCallback: {
    value(name, oldValue, newValue) {
      if (name === ATTR_NAME) {
        newValue = As.boolean(newValue);
        if (newValue) {
          register(this);
        } else {
          unregister(this);
        }
      }
    }
  },

  /**
   * Handles registration when the element is attached to the document.
   *
   * @method attachedCallback
   */
  attachedCallback: {
    value() {
      if ($(this).attr(ATTR_NAME) && As.boolean($(this).attr(ATTR_NAME))) {
        register(this);
      }
    }
  },

  /**
   * Handles unregistration when the element is detached from the document.
   *
   * @method detachedCallback
   */
  detachedCallback: {
    value() {
      unregister(this);
    }
  }
});

export default Draggable = Draggable;

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.ability.Draggable', Draggable);
}
