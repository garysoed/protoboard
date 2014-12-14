import As        from 'src/as';
import Component from 'src/component/component';
import Utils     from 'src/utils';
import Abilities from 'src/ability/abilities';
import Ability   from 'src/ability/ability';
import Draggable from 'src/ability/draggable';

let doc = null;
let template = null;

const EL_NAME = 'pb-c-card';
const ATTR_SHOW_FRONT = 'pb-show-front';

function handleClick() {
  let oldValue = As.boolean($(this).attr(ATTR_SHOW_FRONT) || 'false');
  $(this).attr(ATTR_SHOW_FRONT, !oldValue);
}

/**
 * A representation of a card. To use this, create a `pb-c-card` element with two child elements:
 * - One must have a `pb-front` class. This is the front face of the card.
 * - One must have a `pb-back` class. This is the back face of the card.
 *
 * By default, the card starts by showing its back. If you want to make it start by showing the 
 * front face, add `pb-show-front="true"` to the `pb-c-card`.
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

  attachedCallback() {
    super.attachedCallback();
    this.addEventListener('click', handleClick);
  }

  detachedCallback() {
    this.removeEventListener('click', handleClick);
    super.detachedCallback();
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
            new Draggable(true)).prototype
      });
    }

    doc = currentDoc;
    template = cardTemplate;
  }
}

Utils.makeGlobal('pb.component.Card', Card);
