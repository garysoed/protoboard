import Events from 'src/events';
import Utils  from 'src/utils';

import Abilities   from 'src/ability/abilities';
import Droppable   from 'src/ability/droppable';
import Shuffleable from 'src/ability/shuffleable';
import Triggerable from 'src/ability/triggerable';

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
          {
            [Triggerable.TYPES.DOUBLE_CLICK]: new Shuffleable(true)
          },
          new Droppable(true)).prototype
    });
  }
}

Utils.makeGlobal('pb.region.Deck', Deck);
