import Utils from 'src/utils';

const ATTR_DRAGGABLE = 'draggable';

function setupDraggable() {
  // Propagate the draggable attribute to the root element.
  let rootEl = this.shadowRoot.querySelector('#root');
  $(rootEl).attr('draggable', 'true');
  rootEl.addEventListener('dragstart', handleDragStart);
}

function handleDragStart(event) {
  let dataTransfer = event.dataTransfer;
  dataTransfer.setData('text/html', this);
  dataTransfer.effectAllowed = 'move';

  // TODO: Hook up to DragDrop service.
}

export default class Component extends HTMLElement {
  constructor() {}

  attachedCallback() {
    if (this.hasAttribute(ATTR_DRAGGABLE)) {
      setupDraggable.bind(this)();
    }
  }
}

if (window.TEST_MODE) {
  if (!window.pb) {
    window.pb = {};
  }

  window.pb.Component = Component;
}
