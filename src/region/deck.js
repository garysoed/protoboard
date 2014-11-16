import Region from 'src/region/region';
import Utils from 'src/utils';

let doc = null;
let template = null;

const EL_NAME = 'pb-r-deck';

/**
 * Represents a collection of items that can be sorted.
 */
class Deck extends Region {
  constructor() {
    super();
  }

  createdCallback() {
    super.createdCallback();
    this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
  }

  attachedCallback() {
    super.attachedCallback();
    this.shadowRoot
        .querySelector('#shuffle')
        .addEventListener('click', this.shuffle.bind(this));
  }

  /**
   * Shuffles the children of this element.
   */
  shuffle() {
    let pairs = Utils.toArray(this.children).map(child => [child, Math.random()]);
    pairs.sort((a, b) => Utils.compare(a[1], b[1]));
    let shuffled = pairs.map(pair => pair[0]);
    shuffled.forEach((el => this.appendChild(el)).bind(this));
  }

  static register(currentDoc, deckTemplate) {
    if (doc || template) {
      // Already registered.
      return;
    }

    doc = currentDoc;
    template = deckTemplate;
    document.registerElement(EL_NAME, {prototype: Deck.prototype});
  }
}

export default Deck = Deck;

Utils.makeGlobal('pb.region.Deck', Deck);
