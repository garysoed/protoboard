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
 * Supported abilities:
 * - [[Droppable|ability.Droppable]]: Default enabled. This class uses a custom droppable that 
 *   positions the element to the mouse's cursor.
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
    // TODO(gs): Make the ability fire an event instead. This class should just listen to the drop
    // event.
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
   * @param {!Document} currentDoc The document object to register the element to.
   * @param {!Element} rectTemplate The template for the <code>pb-r-rect</code>'s element shadow 
   *    DOM.
   * @static
   */
  static register(currentDoc, rectTemplate) {
    if (!doc && !template) {
      let smartDroppable = new SmartDroppable(true);
      document.registerElement(EL_NAME,  {
        prototype: Abilities.config(
            Rect,
            {},
            smartDroppable).prototype
      });
    }

    doc = currentDoc;
    template = rectTemplate;
  }
}

export default Rect = Rect;

Utils.makeGlobal('pb.region.Rect', Rect);

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.region.Rect.SmartDroppable', SmartDroppable);
}
