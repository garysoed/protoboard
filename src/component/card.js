import Utils from 'src/utils';

import Component from 'src/component/component';

import Abilities   from 'src/ability/abilities';
import Contextable from 'src/ability/contextable';
import Draggable   from 'src/ability/draggable';
import Rotateable  from 'src/ability/rotateable';
import Toggleable  from 'src/ability/toggleable';

/**
 * A representation of a card. To use this, create a `pb-c-card` element with two child elements:
 * - One must have a `pb-front` class. This is the front face of the card.
 * - One must have a `pb-back` class. This is the back face of the card.
 *
 * By default, the card starts by showing its back. If you want to make it start by showing the 
 * front face, add `pb-showfront="true"` to the `pb-c-card`.
 *
 * ```html
 * <!-- Example: Create a card that starts by displaying its front side -->
 * <pb-c-card pb-showfront="true">
 *   <div class="pb-front">Front side</div>
 *   <div class="pb-back">Back side</div>
 * </pb-c-card>
 * ```
 *
 * Supported abilities:
 * - [[Draggable|ability.Draggable]]: Default enabled.
 * - [[Rotateable|ability.Rotateable]]: Default disabled.
 * - [[Toggleable|ability.Toggleable]]: Default enabled on click.
 * 
 * @class component.Card
 * @extends component.Component
 */

let doc = null;
let template = null;

const EL_NAME = 'pb-c-card';

export default class Card extends Component {

  /**
   * Called when the element is created
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
   * Registers `pb-c-card` to the document.
   *
   * @method register
   * @param {!Document} currentDoc The document object to register the element to.
   * @param {!Element} cardTemplate The template for the <code>pb-c-card</code>'s element shadow 
   *    DOM.
   * @static
   */
  static register(currentDoc, cardTemplate) {
    if (!doc && !template) {
      let toggleable = new Toggleable(true);
      let rotateable = new Rotateable();
      let draggable = new Draggable(true);
      document.registerElement(EL_NAME,  {
        prototype: Abilities.config(
            Card,
            {
              'pb-click': toggleable
            },
            draggable,
            rotateable,
            new Contextable({
              'Flip': toggleable,
              '-': undefined,
              'sub': {
                'Flip': toggleable,
                'Tap / Untap': rotateable
              }
            })).prototype
      });
    }

    doc = currentDoc;
    template = cardTemplate;
  }
}

Utils.makeGlobal('pb.component.Card', Card);
