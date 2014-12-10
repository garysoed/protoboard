import PbElement from 'src/pbelement';
import Utils from 'src/utils';
import PreviewService from 'src/service/preview';

/**
 * Element that displays the innerHTML of the `pb-u-preview` of element currently being hovered 
 * over. This works in tandem with [[ui.Preview|ui.Preview]] and 
 * [[service.Preview|service.Preview]].
 *
 * @class ui.Previewer
 * @extends PbElement
 */

let template = null;
let doc = null;

const _previewElHandler = Symbol();

const EL_NAME = 'pb-u-previewer';

function handlePreviewEl() {
  if (PreviewService.previewedEl) {
    this.innerHTML = PreviewService.previewedEl.innerHTML;
  } else {
    this.innerHTML = '';
  }
}

export default class Previewer extends PbElement {
  createdCallback() {
    super.createdCallback();
    this.createShadowRoot()
        .appendChild(Utils.activateTemplate(template, doc));

    this.attachedCallback();
  }

  attachedCallback() {
    super.attachedCallback();
    this[_previewElHandler] = Utils.observe(
        PreviewService, 
        'previewedEl', 
        handlePreviewEl.bind(this));
  }

  detachedCallback() {
    Object.unobserve(PreviewService, this[_previewElHandler]);
    super.detachedCallback();
  }

  /**
   * Registers `pb-u-previewer` to the document.
   *
   * @method register
   * @static
   * @param {!Document} currentDoc The document object to register the element to.
   * @param {!Element} previewerTemplate The template for the `pb-u-previewer`'s element shadow DOM.
   */
  static register(currentDoc, previewerTemplate) {
    if (!template && !doc) {
      document.registerElement(EL_NAME, {prototype: Previewer.prototype});
    }

    template = previewerTemplate;
    doc = currentDoc;
  }
}

Utils.makeGlobal('pb.ui.Previewer', Previewer);
