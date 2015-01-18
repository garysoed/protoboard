import Utils from 'src/utils';

import Abilities from 'src/ability/abilities';
import Droppable from 'src/ability/droppable';

import Region from 'src/region/region';

import DragDrop from 'src/service/dragdrop';

/**
 * @class region.Hand
 * @extends region.Region
 */

let doc = null;
let template = null;

const EL_NAME = 'pb-r-hand';

class ReorderableDroppable extends Droppable {
  constructor(defaultValue) {
    super(defaultValue);
  }

  trigger(el, event) {
    el.classList.remove('pb-over');
    let lastDraggedEl = DragDrop.lastDraggedEl;
    if (!lastDraggedEl) {
      return;
    }

    // Go through every children and find the index that the element should be.
    let dropped = false;
    for (let child of Utils.toArray(el.children)) {
      let rect = child.getBoundingClientRect();
      if (!dropped && rect.left + rect.width / 2 > event.clientX) {
        dropped = true;
        el.insertBefore(lastDraggedEl, child);
      }
    }

    if (!dropped) {
      el.appendChild(lastDraggedEl);
    }
  }
}

export default class Hand extends Region {

  /**
   * Called when the element is created.
   *
   * @method createdCallback
   */
  createdCallback() {
    super.createdCallback();
    this.createShadowRoot()
        .appendChild(Utils.activateTemplate(template, doc));

    this.attachedCallback();
  }

  /**
   * Called when the element is attached to the document.
   *
   * @method attachedCallback
   */
  attachedCallback() {
    super.attachedCallback();
  }

  /**
   * Called when the element is detached from the document.
   *
   * @method detachedCallback
   */
  detachedCallback() {
    super.detachedCallback();
  }
  
  /**
   * Registers `pb-r-hand` to the document.
   *
   * @method register
   * @static
   * @param  {!Document} currentDoc The document object to register the element to.
   * @param  {!Element} handTemplate The template for the pb-r-hand's element DOM.
   */
  static register(currentDoc, handTemplate) {
    if (!doc && !template) {
      let droppable = new ReorderableDroppable(true);
      document.registerElement(EL_NAME, {
        prototype: Abilities.config(
            Hand,
            {},
            droppable).prototype
      });
    }

    doc = currentDoc;
    template = handTemplate;
  } 
}

Utils.makeGlobal('pb.region.Hand', Hand);

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.region.Hand.ReorderableDroppable', ReorderableDroppable);
}
