import Events    from 'src/events';
import PbElement from 'src/pbelement';
import Utils     from 'src/utils';

import PreviewService from 'src/service/preview';

/**
 * Class that contains a preview if the mouse enters the parent element. This will display
 * the children element as preview.
 *
 * ```html
 * <!-- Hover over the div to show "DETAILS" -->
 * <div id="hover_over_me">
 *   <pb-u-preview>
 *     <div>DETAILS</div>
 *   </pb-u-preview>
 * </div>
 * ```
 *
 * @class ui.Preview
 * @extends PbElement
 */

let registered = false;

const EL_NAME = 'pb-u-preview';

// Private symbols
const __onMouseOver__ = Symbol();
const __onMouseOut__ = Symbol();

export default class Preview extends PbElement {

  /**
   * Callback called when the mouse has left the parent element.
   *
   * @method __onMouseOut__
   * @private
   */
  [__onMouseOut__]() {
    PreviewService.previewedEl = null;
  }

  /**
   * Callback called when the mouse has entered the parent element.
   *
   * @method __onMouseOver__
   * @private
   */
  [__onMouseOver__]() {
    PreviewService.previewedEl = this;
  }

  /**
   * Called when the element is created
   *
   * @method createdCallback
   */
  createdCallback() {
    super.createdCallback();
    this.createShadowRoot();
    this.attachedCallback();
  }

  /**
   * Called when the element is attached to the document.
   *
   * @method attachedCallback
   */
  attachedCallback() {
    super.attachedCallback();
    if (this.parentElement) {
      Events.of(this.parentElement, this)
          .listen('mouseenter', this[__onMouseOver__].bind(this))
          .listen('mouseleave', this[__onMouseOut__].bind(this));
    }
  }

  /**
   * Called when the element is detached from the document.
   *
   * @method attachedCallback
   */
  detachedCallback() {
    if (this.parentElement) {
      Events.of(this.parentElement, this).unlisten();
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
