import Component from 'src/component/component';
import Utils from 'src/utils';

let doc = null;
let template = null;

const EL_NAME = 'pb-c-token';

/**
 * A simple movable component with only one state. Examples of token:
 * - Chess piece
 * - Cubes
 * - Damage marker
 *
 * To use this, create a `pb-c-token` element with one child element. This child element will be
 * displayed as the token.
 *
 * @class component.Token
 * @extends component.Component
 */
export default class Token extends Component {
  constructor() {
    super();
  }

  createdCallback() {
    super.createdCallback();
    this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));

    this.config({ draggable: true });
  }

  /**
   * Registers `pb-c-token` to the document.
   *
   * @method register
   * @static
   * @param {!Document} currentDoc The document object to register the element to.
   * @param {!Element} tokenTemplate The template for the `pb-c-token`'s shadow DOM.
   */
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

Utils.makeGlobal('pb.component.Token', Token);