import Region from 'src/region/region';
import Utils from 'src/utils';

let doc = null;
let template = null;

const EL_NAME = 'pb-r-deck';

/**
 * Represents a collection of items that can be sorted. To use this, create a `pb-r-deck` element.
 * Any child elements of this class are considered to be in the deck.
 *
 * @class region.Deck
 * @extends region.Region
 */
class Deck extends Region {
  constructor() {
    super();
  }

  createdCallback() {
    super.createdCallback();
    this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
    this.attachedCallback();
  }

  attachedCallback() {
    super.attachedCallback();
    this.shadowRoot
        .querySelector('#shuffle')
        .addEventListener('click', this.shuffle.bind(this));
  }

  /**
   * Shuffles the children of this element.
   *
   * @method shuffle
   */
  shuffle() {
    let pairs = Utils.toArray(this.children).map(child => [child, Math.random()]);
    pairs.sort((a, b) => Utils.compare(a[1], b[1]));
    let shuffled = pairs.map(pair => pair[0]);
    shuffled.forEach((el => this.appendChild(el)).bind(this));
  }

  /**
   * Registers `pb-r-deck` to the document.
   *
   * @method register
   * @static
   * @param {!Document} currentDoc The document object to register the element to.
   * @param {!Element} deckTemplate The template for the `pb-r-deck`'s element shadow DOM.
   */
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
