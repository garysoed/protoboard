import Events from 'src/events';
import PbElement from 'src/pbelement';
import PreviewService from 'src/service/preview';
import Utils from 'src/utils';

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

const EL_NAME = 'pb-u-previewer';

// Private symbols.
const __previewElHandler__ = Symbol();

const __onPreviewElChanged__ = Symbol('onPreviewElChanged');

export default class Previewer extends PbElement {

  /**
   * Called when the preview element has changed.
   *
   * @method __onPreviewElChanged__
   * @private
   */
  [__onPreviewElChanged__]() {
    if (PreviewService.previewedEl) {
      this.innerHTML = PreviewService.previewedEl.innerHTML;
    } else {
      this.innerHTML = '';
    }
  }

  /**
   * Called when the element is created
   *
   * @method createdCallback
   */
  createdCallback() {
    super.createdCallback();
    this.createShadowRoot()
        .appendChild(Utils.activateTemplate(template, doc));

    this.attachedCallback();
  }

  /**
   * Called when the element is attached to the document.
   *
   * @method attachedCallback
   */
  attachedCallback() {
    super.attachedCallback();
    this[__previewElHandler__] = Events.of(PreviewService, this)
        .on(PreviewService.Events.ELEMENT_CHANGED,
            this[__onPreviewElChanged__].bind(this));
  }

  /**
   * Called when the element is detached from the document.
   *
   * @method detachedCallback
   */
  detachedCallback() {
    Events.of(PreviewService, this).off();
    super.detachedCallback();
  }

  /**
   * Registers `pb-u-previewer` to the document.
   *
   * @method register
   * @param {!Document} currentDoc The document object to register the element to.
   * @param {!Element} previewerTemplate The template for the <code>pb-u-previewer</code>'s element 
   *    shadow DOM.
   * @static
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
