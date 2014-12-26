import PbElement from 'src/pbelement';
import Utils     from 'src/utils';

import Distribute from 'src/service/distribute';
import DragDrop   from 'src/service/dragdrop';

const CLASS_DISTRIBUTE = 'pb-distribute';
const CLASS_OVER = 'pb-over';

// TODO(gs): Make Distributable
// TODO(gs): Make Droppable

// Private symbols
const __dragEnterCount__ = Symbol();
const __onClick__ = Symbol();
const __onDistributeBegin__ = Symbol();
const __onDistributeEnd__ = Symbol();
const __onDragOver__ = Symbol();
const __onDragEnter__ = Symbol();
const __onDragLeave__ = Symbol();
const __onDrop__ = Symbol();
const __onLastDraggedElChange__ = Symbol();

/**
 * Base class of all regions. All regions are drop targets.
 * @class region.Region
 * @extends HTMLElement
 */
export default class Region extends PbElement {

  /** For testing only */
  constructor() { }

  [__onClick__]() {
    if (Distribute.isActive() && Distribute.next()) {
      this.appendChild(Distribute.next());
    }
  }

  [__onDistributeBegin__]() {
    if (this.shadowRoot) {
      this.shadowRoot.querySelector('#root').classList.add(CLASS_DISTRIBUTE);
    }
  }

  [__onDistributeEnd__]() {
    if (this.shadowRoot) {
      this.shadowRoot.querySelector('#root').classList.remove(CLASS_DISTRIBUTE);
    }
  }

  [__onDragOver__](event) {
    event.preventDefault();
    event.dropEffect = 'move';
  }

  [__onDragEnter__](event) {
    this.classList.add(CLASS_OVER);
    this[__dragEnterCount__]++;
  }

  [__onDragLeave__](e) {
    this[__dragEnterCount__]--;
    if (this[__dragEnterCount__] <= 0) {
      this.classList.remove(CLASS_OVER);
      this[__dragEnterCount__] = 0;
    }
  }

  [__onDrop__]() {
    this.classList.remove(CLASS_OVER);
    this.appendChild(DragDrop.lastDraggedEl);
    // TODO: attached callback doesn't seem to be called on appendChild.
    // https://github.com/webcomponents/webcomponentsjs/issues/18
    if (DragDrop.lastDraggedEl.attachedCallback) {
      DragDrop.lastDraggedEl.attachedCallback();
    }
    DragDrop.lastDraggedEl = null;
  }

  [__onLastDraggedElChange__]() {
    if (!DragDrop.lastDraggedEl) {
      this.classList.remove(CLASS_OVER);
      this[__dragEnterCount__] = 0;
    }
  }

  createdCallback() {
    super.createdCallback();
    this[__dragEnterCount__] = 0;
  }

  attachedCallback() {
    super.attachedCallback();
    this.addEventListener('dragover', this[__onDragOver__]);
    this.addEventListener('dragenter', this[__onDragEnter__]);
    this.addEventListener('dragleave', this[__onDragLeave__]);
    this.addEventListener('drop', this[__onDrop__]);
    this.addEventListener('click', this[__onClick__]);

    $(Distribute)
        .on(Distribute.EventType.BEGIN, this[__onDistributeBegin__].bind(this))
        .on(Distribute.EventType.END, this[__onDistributeEnd__].bind(this));

    Utils.observe(DragDrop, 'lastDraggedEl', this[__onLastDraggedElChange__].bind(this));
  }

  // TODO(gs): Unobserve and unlisten
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
 * @attribute pb-droppable
 */
Region.ATTR_DROPPABLE = 'pb-droppable';

if (window.TEST_MODE) {
  Utils.makeGlobal('pb.region.Region', Region);
}