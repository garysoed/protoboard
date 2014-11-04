import Component from 'src/component/component';
import Utils from 'src/utils';

let doc = null;
let template = null;

const EL_NAME = 'pb-c-token';

export default class Token extends Component {
  constructor() {
    super();
  }

  createdCallback() {
    super.createdCallback();
    let shadowRoot = this.createShadowRoot();
    shadowRoot.appendChild(Utils.activateTemplate(template, doc));

    // TODO: Make a drag handler component.
    var dragHandler = $(shadowRoot.querySelector('content').getDistributedNodes())
        .filter('div')[0];
    this.config({ draggable: dragHandler });
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
