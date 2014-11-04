import DragDrop from 'src/service/dragdrop';

const CLASS_OVER = 'over';

function handleDragOver(event) {
  // TODO: Only enable if the component is compatible.
  event.preventDefault();
  event.dropEffect = 'move';
}

function handleDragEnter(event) {
  event.preventDefault();
  this.classList.add(CLASS_OVER);
}

function handleDragLeave(event) {
  this.classList.remove(CLASS_OVER);
}

function handleDrop(event) {
  this.classList.remove(CLASS_OVER);
  this.appendChild(DragDrop.lastDraggedEl);
}

/**
 * @class Base class of all regions. These are drop targets.
 */
export default class Region extends HTMLElement {

  constructor() {}

  createdCallback() {}

  attachedCallback() {
    this.addEventListener('dragover', handleDragOver);
    this.addEventListener('dragenter', handleDragEnter);
    this.addEventListener('dragleave', handleDragLeave);
    this.addEventListener('drop', handleDrop);
  }
}

if (window.TEST_MODE) {
  if (!window.pb) {
    window.pb = {};
  }

  window.pb.Region = Region;
}