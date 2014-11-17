import As from 'src/as';
import Component from 'src/component/component';
import Utils from 'src/utils';

let doc = null;
let template = null;

const EL_NAME = 'pb-c-card';
const ATTR_SHOW_FRONT = 'showFront';

function handleClick() {
  let oldValue = As.boolean($(this).attr(ATTR_SHOW_FRONT) || 'false');
  $(this).attr(ATTR_SHOW_FRONT, !oldValue);
}

/**
 * A representation of a card.
 */
export default class Card extends Component {
  constructor() {
    super();
  }

  createdCallback() {
    super.createdCallback();
    this.createShadowRoot()
        .appendChild(Utils.activateTemplate(template, doc));
    this.attachedCallback();
  }

  attachedCallback() {
    this.addEventListener('click', handleClick);
    this.config({ draggable: true });
  }

  detachedCallback() {
    this.removeEventListener('click', handleClick);
  }

  static register(currentDoc, cardTemplate) {
    if (doc || template) {
      // Registration has already happened.
      return;
    }

    doc = currentDoc;
    template = cardTemplate;
    document.registerElement(EL_NAME,  {prototype: Card.prototype});
  }
}

Utils.makeGlobal('pb.component.Card', Card);
