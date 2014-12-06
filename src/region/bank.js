import Region from 'src/region/region';
import Distribute from 'src/service/distribute';
import Utils from 'src/utils';

let doc = null;
let template = null;

const EL_NAME = 'pb-r-bank';

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
 * A generic collection of items. To use this, create a `pb-r-bank` element. Set the size of the 
 * element by CSS selector: `pb-r-bank::shadow #root`. Any children of this element are considered 
 * in the bank.
 *
 * Only the first child will be visible.
 * 
 * @class region.Bank
 * @extends region.Region
 */
class Bank extends Region {
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
   * Registers `pb-r-bank` to the document.
   *
   * @method register
   * @static
   * @param {!Document} currentDoc The document object to register the element to.
   * @param {!Element} bankTemplate The template for the `pb-r-bank`'s element shadow DOM.
   */
  static register(currentDoc, bankTemplate) {
    if (doc || template) {
      // Already registered.
      return;
    }

    doc = currentDoc;
    template = bankTemplate;
    document.registerElement(EL_NAME, {prototype: Bank.prototype});
  }
}

export default Bank = Bank;

Utils.makeGlobal('pb.region.Bank', Bank);
