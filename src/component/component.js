import Utils from 'src/utils';
import DragDropService from 'src/service/dragdrop';

const ATTR_DRAGGABLE = 'draggable';

function setupDraggable() {
  let draggables = this.querySelectorAll('*[draggable="true"]');

  // Propagate the draggable attribute to the root element.
  for (let i = 0; i < draggables.length; i++) {
    draggables.item(i).addEventListener('dragstart', handleDragStart.bind(this));
  }
}

function handleDragStart(event) {
  let dataTransfer = event.dataTransfer;
  dataTransfer.effectAllowed = 'move';

  DragDropService.dragStart(this);
}

/**
 * @class  Base class for all components. Classes extending this should call #config at the end of
 *     createdCallback.
 *
 * To make a component draggable, user must have an HTML element with a draggable attribute set to
 * true as a child of this element.
 */
export default class Component extends HTMLElement {
  constructor() {}

  createdCallback() {}

  /**
   * Configures the component.
   * @param {Object} config Configuration used to configure the behavior of this component.
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
  console.log(pb.component.Component);
}
