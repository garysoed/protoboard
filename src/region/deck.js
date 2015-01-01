import Events from 'src/events';
import Utils  from 'src/utils';

import Abilities from 'src/ability/abilities';
import Droppable from 'src/ability/droppable';

import Region from 'src/region/region';

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
export default class Deck extends Region {

  createdCallback() {
    super.createdCallback();
    this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
    this.attachedCallback();
  }

  /**
   * Called when the element is attached to the document.
   *
   * @method attachedCallback
   */
  attachedCallback() {
    super.attachedCallback();
    // TODO(gs): Add shuffle as action.
    Events.of(this.shadowRoot.querySelector('#shuffle'), this)
        .register('click', this.shuffle.bind(this));
  }

  /**
   * Called when the element is detached from the document.
   *
   * @method detachedCallback
   */
  detachedCallback() {
    super.detachedCallback();
    Events.of(this.shadowRoot.querySelector('#shuffle'), this).unregister();
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
    if (!doc || !template) {
      doc = currentDoc;
      template = deckTemplate;
    }

    document.registerElement(EL_NAME, {
      prototype: Abilities.config(
          Deck,
          {},
          new Droppable(true)).prototype
    });
  }
}

Utils.makeGlobal('pb.region.Deck', Deck);
