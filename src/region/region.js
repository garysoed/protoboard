import Distribute from 'src/service/distribute';
import DragDrop from 'src/service/dragdrop';
import Utils from 'src/utils';

const CLASS_DISTRIBUTE = 'pb-distribute';
const CLASS_OVER = 'pb-over';

function handleDragOver(event) {
  // TODO: Only enable if the component is compatible.
  event.preventDefault();
  event.dropEffect = 'move';
}

function handleDragEnter(event) {
  event.preventDefault();
  this.classList.add(CLASS_OVER);
}

function handleDragLeave() {
  this.classList.remove(CLASS_OVER);
}

function handleDrop() {
  this.classList.remove(CLASS_OVER);
  this.add(DragDrop.lastDraggedEl);
}

function handleClick() {
  if (Distribute.isActive() && Distribute.next()) {
    this.add(Distribute.next());
  }
}

function handleDistributeBegin() {
  if (this.shadowRoot) {
    this.shadowRoot.querySelector('#root').classList.add(CLASS_DISTRIBUTE);
  }
}

function handleDistributeEnd() {
  if (this.shadowRoot) {
    this.shadowRoot.querySelector('#root').classList.remove(CLASS_DISTRIBUTE);
  }
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
    this.addEventListener('click', handleClick);

    $(Distribute)
        .on(Distribute.EventType.BEGIN, handleDistributeBegin.bind(this))
        .on(Distribute.EventType.END, handleDistributeEnd.bind(this));
  }

  add(el) {
    this.appendChild(el);
  }
}

if (window.TEST_MODE) {
  Utils.makeGlobal('pb.region.Region', Region);
}