import Component from 'src/component/component';
import Utils from 'src/utils';
import Abilities from 'src/ability/abilities';
import Draggable from 'src/ability/draggable';

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
 * ```html
 * <!-- Example: A square token -->
 * <pb-c-token>
 *   <div style="background: red; width: 50px; height: 50px;"></div>
 * <pb-c-token>
 * ```
 *
 * Supported abilities:
 * - [[Draggable|ability.Draggable]]: Default enabled.
 *
 * @class component.Token
 * @extends component.Component
 */
export default class Token extends Component {

  /**
   * Called when the element is created.
   *
   * @method createdCallback
   */
  createdCallback() {
    super.createdCallback();
    this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
  }

  /**
   * Registers `pb-c-token` to the document.
   *
   * @method register
   * @param {!Document} currentDoc The document object to register the element to.
   * @param {!Element} tokenTemplate The template for the <code>pb-c-token</code>'s shadow DOM.
   * @static
   */
  static register(currentDoc, tokenTemplate) {
    if (!doc && !template) {
      let draggable = new Draggable(true);
      document.registerElement(EL_NAME, {
        prototype: Abilities.config(
            Token,
            {},
            draggable).prototype
      });
    }
    
    doc = currentDoc;
    template = tokenTemplate;
  }
}

Utils.makeGlobal('pb.component.Token', Token);
