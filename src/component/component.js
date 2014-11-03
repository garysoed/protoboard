import Utils from 'src/utils';
// import DragDropService from 'src/service/dragdrop';

const ATTR_DRAGGABLE = 'draggable';

function setupDraggable() {
  // Propagate the draggable attribute to the root element.
  let rootEl = Utils.getContentElementRoot(this.shadowRoot);
  $(rootEl).attr('draggable', 'true');
  rootEl.addEventListener('dragstart', handleDragStart);
}

function handleDragStart(event) {
  let dataTransfer = event.dataTransfer;
  dataTransfer.setData('text/html', event.target);
  dataTransfer.effectAllowed = 'move';

  // DragDropService.dragStart(this);
}

export default class Component extends HTMLElement {
  constructor() {}

  attachedCallback() {
    if (this.hasAttribute(ATTR_DRAGGABLE)) {
      setupDraggable.bind(this)();
    }
  }
}