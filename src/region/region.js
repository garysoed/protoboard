import Events    from 'src/events';
import PbElement from 'src/pbelement';
import Utils     from 'src/utils';

import Distribute from 'src/service/distribute';
import DragDrop   from 'src/service/dragdrop';

const CLASS_DISTRIBUTE = 'pb-distribute';

// TODO(gs): Make Distributable

// Private symbols
const __onClick__ = Symbol();
const __onDistributeBegin__ = Symbol();
const __onDistributeEnd__ = Symbol();

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

  createdCallback() {
    super.createdCallback();
  }

  attachedCallback() {
    super.attachedCallback();
    Events.of(this, this).listen('click', this[__onClick__].bind(this));

    $(Distribute)
        .on(Distribute.EventType.BEGIN, this[__onDistributeBegin__].bind(this))
        .on(Distribute.EventType.END, this[__onDistributeEnd__].bind(this));
  }

  detachedCallback() {
    Events.of(this, this).unlisten();
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
 * @attribute pb-droppable
 */
Region.ATTR_DROPPABLE = 'pb-droppable';

if (window.TEST_MODE) {
  Utils.makeGlobal('pb.region.Region', Region);
}