import Utils from 'src/utils';
import DragDropService from 'src/service/dragdrop';
import PbElement from 'src/pbelement';

const ATTR_DRAGGABLE = 'draggable';
const CLASS_DRAGGED = 'pb-dragged';

function setupDraggable() {
  let draggables = this.querySelectorAll('*[draggable="true"]');

  // Propagate the draggable attribute to the root element.
  Utils.toArray(draggables).forEach((draggable => {
    draggable.addEventListener('dragstart', handleDragStart.bind(this));
    draggable.addEventListener('dragend', handleDragEnd.bind(this));
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
 * To make a component draggable, user must have an HTML element with a draggable attribute set to
 * true as a child of this element.
 * 
 * @class component.Component
 * @extends PbElement  
 */
export default class Component extends PbElement {

  /**
   * @constructor
   */
  constructor() {
    super.constructor();
  }

  createdCallback() {
    super.createdCallback();
  }

  /**
   * Configures the component.
   *
   * @method config
   * @param {!Object} config Configuration used to configure the behavior of this component.
   * @param {boolean} config.draggable True iff the component should be draggable.
   */
  config(config) {
    if (config.draggable) {
      setupDraggable.bind(this)();
    }
  }
}

if (window.TEST_MODE) {
  Utils.makeGlobal('pb.component.Component', Component);
}
