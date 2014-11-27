import PbElement from 'src/pbelement';
import Utils from 'src/utils';
import PreviewService from 'src/service/preview';

/**
 * Class that contains a preview if the mouse enters the parent element. This will display
 * the children element as preview.
 *
 * @class ui.Preview
 * @extends PbElement
 */

let registered = false;

const EL_NAME = 'pb-u-preview';

const _mouseOverHandler = Symbol();
const _mouseOutHandler = Symbol();

function handleMouseOver() {
  PreviewService.previewedEl = this;
}

function handleMouseOut(e) {
  PreviewService.previewedEl = null;
}

export default class Preview extends PbElement {
  createdCallback() {
    super.createdCallback();
    this.createShadowRoot();

    // Initializes the variables.
    this[_mouseOverHandler] = handleMouseOver.bind(this);
    this[_mouseOutHandler] = handleMouseOut.bind(this);

    this.attachedCallback();
  }

  attachedCallback() {
    super.attachedCallback();
    if (this.parentElement) {
      this.parentElement.addEventListener('mouseenter', this[_mouseOverHandler]);
      this.parentElement.addEventListener('mouseleave', this[_mouseOutHandler]);
    }
  }

  detachedCallback() {
    if (this.parentElement) {
      this.parentElement.removeEventListener('mouseenter', this[_mouseOverHandler]);
      this.parentElement.removeEventListener('mouseleave', this[_mouseOutHandler]);
    }
    super.detachedCallback();
  }

  /**
   * Registers `pb-u-preview` to the document.
   *
   * @method register
   * @static
   */
  static register() {
    if (!registered) {
      document.registerElement(EL_NAME, {prototype: Preview.prototype});
    }
  }
}

Utils.makeGlobal('pb.ui.Preview', Preview);
