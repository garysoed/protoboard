import Utils from 'src/utils';

import Abilities from 'src/ability/abilities';
import Droppable from 'src/ability/droppable';

import Region from 'src/region/region';

import DragDrop from 'src/service/dragdrop';

let doc = null;
let template = null;

const EL_NAME = 'pb-r-rect';

/**
 * An arbitrary rectangular region. You can position elements anywhere in this region.
 *
 * @class region.Rect
 * @extends region.Region
 */

class SmartDroppable extends Droppable {

  constructor(defaultValue) {
    super(defaultValue);
  }

  /**
   * Drop the last dragged element on the given element
   *
   * @method trigger
   * @param {!Element} el The element to drop the dragged element into.
   * @param {!Event} event Event object that triggered the call.
   */
  trigger(el, event) {
    el.classList.remove('pb-over');
    let lastDraggedEl = DragDrop.lastDraggedEl;
    if (!lastDraggedEl) {
      return;
    }
    el.appendChild(lastDraggedEl);

    let screenCoord = lastDraggedEl.getBoundingClientRect();
    let dLeft = event.clientX - screenCoord.left - DragDrop.offsetX;
    let dTop = event.clientY - screenCoord.top - DragDrop.offsetY;
    lastDraggedEl.style.left = `${lastDraggedEl.offsetLeft + dLeft}px`;
    lastDraggedEl.style.top = `${lastDraggedEl.offsetTop + dTop}px`;

    // TODO(gs): attached callback doesn't seem to be called on appendChild.
    // https://github.com/webcomponents/webcomponentsjs/issues/18
    if (DragDrop.lastDraggedEl.attachedCallback) {
      DragDrop.lastDraggedEl.attachedCallback();
    }
    DragDrop.dragEnd();
  }
}


class Rect extends Region {
  constructor() {
    super();
  }

  createdCallback() {
    super.createdCallback();
    this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
  }

  /**
   * Registers `pb-r-rect` to the document.
   *
   * @method register
   * @static
   * @param {!Document} currentDoc The document object to register the element to.
   * @param {!Element} rectTemplate The template for the `pb-r-rect`'s element shadow DOM.
   */
  static register(currentDoc, rectTemplate) {
    if (doc || template) {
      // Registration has already happened.
      return;
    }

    doc = currentDoc;
    template = rectTemplate;
    document.registerElement(EL_NAME,  {
      prototype: Abilities.config(
          Rect,
          {},
          new SmartDroppable(true)).prototype
    });
  }
}

export default Rect = Rect;

Utils.makeGlobal('pb.region.Rect', Rect);

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.region.Rect.SmartDroppable', SmartDroppable);
}
