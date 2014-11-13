import Region from 'src/region/region';
import Distribute from 'src/service/distribute';
import Utils from 'src/utils';

let doc = null;
let template = null;

const EL_NAME = 'pb-r-bag';

/**
 * Handles event called when the "Distribute" option in the context menu is clicked.
 *
 * @param  {!Event} event The event object
 */
function handleDistributeClick(event) {
  this.distribute();
  event.stopPropagation();
}

/**
 * @class A generic collection of items.
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
   */
  distribute() {
    Distribute.begin(this);
  }

  /**
   * @return {Element} The first child of the element.
   */
  next() {
    return this.children[0];
  }

  static register(currentDoc, deckTemplate) {
    if (doc || template) {
      // Already registered.
      return;
    }

    doc = currentDoc;
    template = deckTemplate;
    document.registerElement(EL_NAME, {prototype: Bag.prototype});
  }
}

export default Bag = Bag;

Utils.makeGlobal('pb.region.Bag', Bag);
