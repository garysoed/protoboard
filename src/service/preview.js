import Utils from 'src/utils';

/**
 * Service that lets the user preview an element on mouse hover.
 *
 * @class service.Preview
 * @static
 */
let Preview = {

  /**
   * Element that is being previewed, if any.
   *
   * @type Element
   * @property previewedEl
   */
  previewedEl: null
}

export default Preview = Preview;

Utils.makeGlobal('pb.service.Preview', Preview);
