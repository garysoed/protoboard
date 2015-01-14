import Utils from 'src/utils';

/**
 * Service that lets the user preview an element on mouse hover.
 *
 * @class service.Preview
 * @static
 */

// Private symbols
const __previewedEl__ = Symbol();

let Preview = {

  [__previewedEl__]: null,

  /**
   * Element that is being previewed, if any.
   *
   * @property previewedEl
   * @type Element
   */
  get previewedEl() {
    return this[__previewedEl__];
  },
  set previewedEl(el) {
    this[__previewedEl__] = el;
  }
};

export default Preview = Preview;

Utils.makeGlobal('pb.service.Preview', Preview);
