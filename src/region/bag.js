import Utils     from 'src/utils';

import Abilities from 'src/ability/abilities';
import Draggable from 'src/ability/draggable';
import Droppable from 'src/ability/droppable';

import Region    from 'src/region/region';

/**
 * A collection of components. You cannot see the component until you drag one out of it.
 *
 * To make a bag, create a `pb-r-bag` element. You can override the content of the placeholder by
 * creating a child element with a `pb-placeholder-content` attribute. This element will be used for
 * the placeholder content.
 * 
 * @class region.Bag
 * @extends region.Region
 */

const EL_NAME = 'pb-r-bag';
const ATTR_PLACEHOLDER = 'pb-placeholder';
const ATTR_PLACEHOLDER_CONTENT = 'pb-placeholder-content';

// Private symbols
const __bag__ = Symbol();
const __draggable__ = Symbol('draggable');
const __placeHolderEl__ = Symbol('placeHolderEl');

let doc = null;
let template = null;
let placeHolderTmp = null;


class BagDraggable extends Draggable {

  constructor(bag) {
    super(true);
    this[__bag__] = bag;
  }

  getMovedElement(el) {
    let candidates = Utils.toArray(this[__bag__].children).filter(
        child => $(child).attr(ATTR_PLACEHOLDER) === undefined);
    return candidates[Math.round(Math.random() * (candidates.length - 1))];
  }
}

export default class Bag extends Region {

  /**
   * Called when the element is created.
   *
   * @method createdCallback
   */
  createdCallback() {
    super.createdCallback();
    this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));

    this[__placeHolderEl__] = this.querySelector(`[${ATTR_PLACEHOLDER}]`);

    if (!this[__placeHolderEl__]) {
      let placeHolderContent = this.querySelector(`[${ATTR_PLACEHOLDER_CONTENT}]`) ||
          Utils.activateTemplate(placeHolderTmp, doc);

      this[__placeHolderEl__] = doc.createElement('div');
      this[__placeHolderEl__].appendChild(placeHolderContent);
      $(this[__placeHolderEl__]).attr(ATTR_PLACEHOLDER, '');
      this.insertBefore(this[__placeHolderEl__], this.lastChild);
    }

    this[__draggable__] = new BagDraggable(this);
    this[__draggable__].setDefaultValue(this[__placeHolderEl__]);

    this.attachedCallback();
  }

  /**
   * Called when the element is attached to the document.
   *
   * @method attachedCallback
   */
  attachedCallback() {
    super.attachedCallback();
    this[__draggable__].attachedCallback(this[__placeHolderEl__]);
  }

  /**
   * Called when the element is detached from the document.
   *
   * @method detachedCallback
   */
  detachedCallback() {
    this[__draggable__].detachedCallback(this[__placeHolderEl__]);
    super.detachedCallback();
  }

  /**
   * Called when the element's attribute has changed
   *
   * @method attributeChangedCallback
   * @param  {string} name The name of the changed attribute.
   * @param  {string} oldValue The old value of the attribute.
   * @param  {string} newValue The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    this[__draggable__].attributeChangedCallback(this[__placeHolderEl__], name, oldValue, newValue);
  }
  
  /**
   * Registers `pb-r-bag` to the document.
   *
   * @method register
   * @static
   * @param  {!Document} currentDoc The document object to register the element to.
   * @param  {!Element} bagTemplate The template for the pb-r-bag's element DOM.
   * @return {[type]} [description]
   */
  static register(currentDoc, bagTemplate, placeHolderTemplate) {
    if (!doc || !template) {
      doc = currentDoc;
      template = bagTemplate;
      placeHolderTmp = placeHolderTemplate;
    }

    document.registerElement(EL_NAME, {
      prototype: Abilities.config(
          Bag,
          {},
          new Droppable(true)).prototype
    });
  } 
}

Bag.prototype[__draggable__] = null;
Bag.prototype[__placeHolderEl__] = null;

Utils.makeGlobal('pb.region.Bag', Bag);

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.region.Bag.BagDraggable', BagDraggable);
}