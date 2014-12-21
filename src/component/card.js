import Utils from 'src/utils';

import Component from 'src/component/component';

import Abilities  from 'src/ability/abilities';
import Draggable  from 'src/ability/draggable';
import Rotateable from 'src/ability/rotateable';
import Toggleable from 'src/ability/toggleable';

let doc = null;
let template = null;

const EL_NAME = 'pb-c-card';

/**
 * A representation of a card. To use this, create a `pb-c-card` element with two child elements:
 * - One must have a `pb-front` class. This is the front face of the card.
 * - One must have a `pb-back` class. This is the back face of the card.
 *
 * By default, the card starts by showing its back. If you want to make it start by showing the 
 * front face, add `pb-showfront="true"` to the `pb-c-card`.
 * 
 * @class component.Card
 * @extends component.Component
 */
export default class Card extends Component {

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
   * @static
   * @param {!Document} currentDoc The document object to register the element to.
   * @param {!Element} cardTemplate The template for the pb-c-card's element shadow DOM.
   */
  static register(currentDoc, cardTemplate) {
    if (!doc && !template) {
      document.registerElement(EL_NAME,  {
        prototype: Abilities.config(
            Card,
            {
              'pb-click': new Toggleable(true),
            },
            new Draggable(true),
            new Rotateable()).prototype
      });
    }

    doc = currentDoc;
    template = cardTemplate;
  }
}

Utils.makeGlobal('pb.component.Card', Card);
