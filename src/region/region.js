import Distribute from 'src/service/distribute';
import DragDrop from 'src/service/dragdrop';
import PbElement from 'src/pbelement';
import Utils from 'src/utils';

const CLASS_DISTRIBUTE = 'pb-distribute';
const CLASS_OVER = 'pb-over';

const _dragEnterCount = Symbol();

function handleDragOver(event) {
  // TODO: Only enable if the component is compatible.
  event.preventDefault();
  event.dropEffect = 'move';
}

function handleDragEnter(e) {
  this.classList.add(CLASS_OVER);
  this[_dragEnterCount]++;
}

function handleDragLeave(e) {
  this[_dragEnterCount]--;
  if (this[_dragEnterCount] <= 0) {
    this.classList.remove(CLASS_OVER);
    this[_dragEnterCount] = 0;
  }
}

function handleDrop() {
  this.classList.remove(CLASS_OVER);
  this.appendChild(DragDrop.lastDraggedEl);
  DragDrop.lastDraggedEl = null;
}

function handleClick() {
  if (Distribute.isActive() && Distribute.next()) {
    this.appendChild(Distribute.next());
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

function handleLastDraggedElChange() {
  if (!DragDrop.lastDraggedEl) {
    this.classList.remove(CLASS_OVER);
    this[_dragEnterCount] = 0;
  }
}

/**
 * Base class of all regions. All regions are drop targets.
 * @class region.Region
 * @extends HTMLElement
 */
export default class Region extends PbElement {

  /** For testing only */
  constructor() { }

  createdCallback() {
    super.createdCallback();
    this[_dragEnterCount] = 0;
  }

  attachedCallback() {
    super.attachedCallback();
    this.addEventListener('dragover', handleDragOver);
    this.addEventListener('dragenter', handleDragEnter);
    this.addEventListener('dragleave', handleDragLeave);
    this.addEventListener('drop', handleDrop);
    this.addEventListener('click', handleClick);

    $(Distribute)
        .on(Distribute.EventType.BEGIN, handleDistributeBegin.bind(this))
        .on(Distribute.EventType.END, handleDistributeEnd.bind(this));

    Utils.observe(DragDrop, 'lastDraggedEl', handleLastDraggedElChange.bind(this));
  }
}

/**
 * Refers to pb-droppable attribute
 *
 * @type string
 * @property ATTR_DROPPABLE
 * @static
 */

/**
 * If set to true, this will be droppable for any kind of elements.
 * If set to false, this will not be droppable.
 * Otherwise, the string will be treated as a selector for elements that can be dropped into this
 * element. 
 *
 * @ttribute pb-droppable
 */
Region.ATTR_DROPPABLE = 'pb-droppable';

if (window.TEST_MODE) {
  Utils.makeGlobal('pb.region.Region', Region);
}