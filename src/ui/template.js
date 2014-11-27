import Utils from 'src/utils';
import PbElement from 'src/pbelement';
import As from 'src/as';

let doc = null;
let handlebars = null;

const EL_NAME = 'pb-u-template';

/**
 * Contains a handlebars js template. When this element is created, it will process the handlebars
 * js template within it and replace itself with the processed templates. To pass in variables into
 * the template, add `data-<name>="<var>"` attributes to the element, where `name` is the key to be
 * used in the template, and var is the property name accessible globally.
 *
 * This class also registers a `{{#pb-copy <n>}}` block helper. This copies the inner block n times.
 *
 * @class ui.Template
 */
export default class Template extends PbElement {
  constructor() {
    super();
  }

  createdCallback() {
    super.createdCallback();
    let templateStr = this.innerHTML;
    let data = {};
    for (let key in this.dataset) {
      let valueStr = this.dataset[key];
      data[key] = window[valueStr] || valueStr;
    }
    $(this).replaceWith(handlebars.compile(this.innerHTML)(data));
  }

  /**
   * Registers `pb-u-template` to the document.
   *
   * @method register
   * @static
   * @param {!Document} currentDoc The document object to register the element to.
   * @param {!Handlebars} handlebars_ref Reference to the Handlebars library.
   */
  static register(currentDoc, handlebars_ref) {
    if (!doc && !handlebars) {
      // Only registers once.
      document.registerElement(EL_NAME, {prototype: Template.prototype});
    }
    
    doc = currentDoc;
    handlebars = handlebars_ref;

    handlebars.registerHelper('pb-copy', function(context, options) {
      let rv = '';
      for (let i = 0; i < As.int(context); i++) {
        rv += options.fn(this);
      } 
      return rv;
    });
  }
}

Utils.makeGlobal('pb.ui.Template', Template);
