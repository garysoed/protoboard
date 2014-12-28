import Events    from 'src/events';
import PbElement from 'src/pbelement';
import Utils     from 'src/utils';

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
    this.attachedCallback();
  }

  attachedCallback() {
    super.attachedCallback();
    if (this.parentElement) {
      Events.of(this.parentElement, this)
          .register('mouseenter', handleMouseOver.bind(this))
          .register('mouseleave', handleMouseOut.bind(this));
    }
  }

  detachedCallback() {
    if (this.parentElement) {
      Events.of(this.parentElement, this).unregister();
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
