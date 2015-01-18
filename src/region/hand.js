import Utils from 'src/utils';

import Abilities from 'src/ability/abilities';
import Droppable from 'src/ability/droppable';

import Region from 'src/region/region';

/**
 * @class region.Hand
 * @extends region.Region
 */

let doc = null;
let template = null;

const EL_NAME = 'pb-r-hand';

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
      let droppable = new Droppable(true);
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
