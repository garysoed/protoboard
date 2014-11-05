import Component from 'src/component/component';
import Utils from 'src/utils';

let doc = null;
let template = null;

const EL_NAME = 'pb-c-card';

/**
 * A representation of a card.
 */
export default class Card extends Component {
  constructor() {
    super();
  }

  createdCallback() {
    super.createdCallback();
    let shadowRoot = this.createShadowRoot();
    shadowRoot.appendChild(Utils.activateTemplate(template, doc));
    
    this.config({ draggable: true });
  }

  static register(currentDoc, tokenTemplate) {
    if (doc || template) {
      // Registration has already happened.
      return;
    }

    doc = currentDoc;
    template = tokenTemplate;
    document.registerElement(EL_NAME,  {prototype: Card.prototype});
  }
}

if (!window.pb) {
  window.pb = {};
}

window.pb.Card = Card;
