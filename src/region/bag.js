import Region from 'src/region/region';
import Distribute from 'src/service/distribute';
import Utils from 'src/utils';

let doc = null;
let template = null;

const EL_NAME = 'pb-r-bag';

/**
 * Handles event called when the "Distribute" option in the context menu is clicked.
 *
 * @param {!Event} event The event object
 * @private
 */
function handleDistributeClick(event) {
  this.distribute();
  event.stopPropagation();
}

/**
 * A generic collection of items. To use this, create a `pb-r-bag` element. Set the size of the 
 * element by CSS selector: `pb-r-bag::shadow #root`. Any children of this element are considered in
 * the bag.
 * 
 * @class region.Bag
 * @extends region.Region
 */
class Bag extends Region {
  constructor() {
    super();
  }

  createdCallback() {
    super.createdCallback();
    this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));

    this.shadowRoot.querySelector('#distribute')
        .addEventListener('click', handleDistributeClick.bind(this));
  }

  /**
   * Begins the distribute process.
   * @method distribute
   */
  distribute() {
    Distribute.begin(this);
  }

  /**
   * @method next
   * @return {Element} The first child of the element.
   */
  next() {
    return this.children[0];
  }

  /**
   * Registers `pb-r-bag` to the document.
   *
   * @method register
   * @static
   * @param {!Document} currentDoc The document object to register the element to.
   * @param {!Element} bagTemplate The template for the `pb-r-bag`'s element shadow DOM.
   */
  static register(currentDoc, bagTemplate) {
    if (doc || template) {
      // Already registered.
      return;
    }

    doc = currentDoc;
    template = bagTemplate;
    document.registerElement(EL_NAME, {prototype: Bag.prototype});
  }
}

export default Bag = Bag;

Utils.makeGlobal('pb.region.Bag', Bag);
