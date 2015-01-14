import Events from 'src/events';
import Utils  from 'src/utils';

import Abilities   from 'src/ability/abilities';
import Droppable   from 'src/ability/droppable';
import Shuffleable from 'src/ability/shuffleable';
import Triggerable from 'src/ability/triggerable';

import Region from 'src/region/region';

/**
 * Represents a collection of items that can be sorted. To use this, create a `pb-r-deck` element.
 * Any child elements of this class are considered to be in the deck.
 *
 * ```html
 * <!-- Example: Deck containing two cards -->
 * <pb-r-deck>
 *   <pb-c-card id="card1">
 *     <div class="pb-front">Front</div>
 *     <div class="pb-back">Back</div>
 *   </pb-c-card>
 *   <pb-c-card id="card2">
 *     <div class="pb-front">Front</div>
 *     <div class="pb-back">Back</div>
 *   </pb-c-card>
 * </pb-r-deck>
 * ```
 *
 * Supported abilities:
 * - [[Droppable|ability.Droppable]]: Default enabled.
 * - [[Shuffleable|ability.Shuffleable]]: Default enabled on double click.
 *
 * @class region.Deck
 * @extends region.Region
 */

let doc = null;
let template = null;

const EL_NAME = 'pb-r-deck';

export default class Deck extends Region {

  /**
   * Called when the element is created.
   *
   * @method createdCallback
   */
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
   * @param {!Document} currentDoc The document object to register the element to.
   * @param {!Element} deckTemplate The template for the <code>pb-r-deck</code>'s element shadow 
   *    DOM.
   * @static
   */
  static register(currentDoc, deckTemplate) {
    if (!doc && !template) {
      let shuffleable = new Shuffleable(true);
      let droppable = new Droppable(true);
      document.registerElement(EL_NAME, {
        prototype: Abilities.config(
            Deck,
            {
              [Triggerable.TYPES.DOUBLE_CLICK]: shuffleable
            },
            droppable).prototype
      });
    }

    doc = currentDoc;
    template = deckTemplate;
  }
}

Utils.makeGlobal('pb.region.Deck', Deck);
