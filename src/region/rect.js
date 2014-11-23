import Region from 'src/region/region';
import Utils from 'src/utils';

let doc = null;
let template = null;

const EL_NAME = 'pb-r-rect';

/**
 * An arbitrary rectangular region.
 *
 * @class region.Rect
 * @extends region.Region
 */
class Rect extends Region {
  constructor() {
    super();
  }

  createdCallback() {
    super.createdCallback();
    this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
  }

  /**
   * Registers `pb-r-rect` to the document.
   *
   * @method register
   * @static
   * @param {!Document} currentDoc The document object to register the element to.
   * @param {!Element} rectTemplate The template for the `pb-r-rect`'s element shadow DOM.
   */
  static register(currentDoc, rectTemplate) {
    if (doc || template) {
      // Registration has already happened.
      return;
    }

    doc = currentDoc;
    template = rectTemplate;
    document.registerElement(EL_NAME,  {prototype: Rect.prototype});
  }
}

export default Rect = Rect;

Utils.makeGlobal('pb.region.Rect', Rect);
