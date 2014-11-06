import Component from 'src/component/component';
import Utils from 'src/utils';

let doc = null;
let template = null;

const EL_NAME = 'pb-c-token';

/**
 * A simple movable component with only one state. Examples of token:
 *   - Chess piece
 *   - Cubes
 *   - Damage marker
 */
export default class Token extends Component {
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
    document.registerElement(EL_NAME,  {prototype: Token.prototype});
  }
}

if (!window.pb) {
  window.pb = {};
}

window.pb.Token = Token;
