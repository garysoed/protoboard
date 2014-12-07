import Utils from 'src/utils';
import DragDropService from 'src/service/dragdrop';
import PbElement from 'src/pbelement';

const CLASS_DRAGGED = 'pb-dragged';

function setupDraggable() {
  // Propagate the draggable attribute to the root element.
  Utils.toArray(this.children).forEach((child => {
    $(child).attr('draggable', 'true');
    child.addEventListener('dragstart', handleDragStart.bind(this));
    child.addEventListener('dragend', handleDragEnd.bind(this));
  }).bind(this));
}

function handleDragEnd() {
  this.classList.remove(CLASS_DRAGGED);
}

function handleDragStart(event) {
  let dataTransfer = event.dataTransfer;
  dataTransfer.effectAllowed = 'move';
  this.classList.add(CLASS_DRAGGED);

  DragDropService.dragStart(this);
}

/**
 * Base class for all components. Classes extending this should call 
 * [[#config|component.Component#config]] at the end of `createdCallback`.
 * 
 * @class component.Component
 * @extends PbElement  
 */
export default class Component extends PbElement {

  /**
   * For testing only.
   */
  constructor() { }

  createdCallback() {
    super.createdCallback();
  }

  /**
   * Configures the component by reading from the attributes.
   *
   * @method config
   */
  config() {
    Utils.toArray(this.attributes).forEach(attribute => {
      switch (attribute.name) {
        case Component.ATTR_DRAGGABLE:
          setupDraggable.bind(this)();
          break;
      }
    });
  }

  /**
   * Sets the default attribute to the specified value.
   * @param {string} name Name of the attribute to set.
   * @param {Object=} value Value of the attribute to set.
   */
  setDefaultAttribute(name, value) {
    if ($(this).attr(name) === undefined) {
      $(this).attr(name, value);
    }
  }
}

/**
 * Refers to pb-draggable attribute.
 * 
 * @type string
 * @property ATTR_DRAGGABLE
 * @static
 */
Component.ATTR_DRAGGABLE = 'pb-draggable';

/**
 * Set to true to make this element draggable.
 * @attribute pb-draggable
 */

if (window.TEST_MODE) {
  Utils.makeGlobal('pb.component.Component', Component);
}
