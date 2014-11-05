import Utils from 'src/utils';
import DragDropService from 'src/service/dragdrop';

const ATTR_DRAGGABLE = 'draggable';

function setupDraggable(draggable) {
  // Propagate the draggable attribute to the root element.
  $(draggable).attr('draggable', 'true');
  draggable.addEventListener('dragstart', handleDragStart.bind(this));
}

function handleDragStart(event) {
  let dataTransfer = event.dataTransfer;
  dataTransfer.effectAllowed = 'move';

  DragDropService.dragStart(this);
}

/**
 * @class  Base class for all components. Classes extending this should call #config at the end of
 *     createdCallback.
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
      setupDraggable.bind(this)(config.draggable);
    }
  }
}

if (window.TEST_MODE) {
  if (!window.pb) {
    window.pb = {};
  }

  window.pb.Component = Component;
}
