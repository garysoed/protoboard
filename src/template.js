import Utils from 'src/utils';
import PbElement from 'src/pbelement';
import As from 'src/as';

let doc = null;
let handlebars = null;

const EL_NAME = 'pb-template';

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

Utils.makeGlobal('pb.Template', Template);
