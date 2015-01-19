import Check     from 'src/check';
import PbElement from 'src/pbelement';
import Utils     from 'src/utils';

/**
 * Contains a handlebars js template. When this element is created, it will process the handlebars
 * js template within it and replace itself with the processed templates. To pass in variables into
 * the template, add `data-<name>="<var>"` attributes to the element, where `name` is the key to be
 * used in the template, and var is the property name accessible globally.
 *
 * This class also registers a `{{#pb-for <from> <to> <step>}}` block helper. This is a simple for
 * loop that copies the inner block several times. You can access the index of the loop using the
 * `@index` variable.
 *
 * @class ui.Template
 * @extends PbElement
 */

let doc = null;
let handlebars = null;

const EL_NAME = 'pb-u-template';

const ATTR_TEMPLATE = 'pb-template';

// Private symbols.
const __getGlobal__ = Symbol();

export default class Template extends PbElement {

  [__getGlobal__](path) {
    return path.split('.').reduce((previousValue, currentValue) => {
      if (previousValue) {
        return previousValue[currentValue];
      } else {
        return previousValue;
      }
    }, window);
  }

  /**
   * Called when the element is created
   *
   * @method createdCallback
   */
  createdCallback() {
    super.createdCallback();

    // Get the data
    let dataPromises = [];
    for (let key in this.dataset) {
      let valueStr = this.dataset[key];
      let value = this[__getGlobal__](valueStr) || valueStr;
      if (value instanceof Promise) {
        dataPromises.push(value.then(result => {
          return [key, result];
        }));
      } else {
        dataPromises.push(Promise.resolve([key, value]));
      }
    }

    Promise.all(dataPromises)
        .then(dataArray => {
          let data = Utils.fromArrayOfArrays(dataArray);
          let templateStr = this.innerHTML.replace('&gt;', '>');
          $(this).replaceWith(handlebars.compile(templateStr)(data));
        });
  }

  /**
   * Registers `pb-u-template` to the document.
   *
   * @method register
   * @param {!Document} currentDoc The document object to register the element to.
   * @param {!Handlebars} handlebars_ref Reference to the Handlebars library.
   * @static
   */
  static register(currentDoc, handlebars_ref) {
    if (!doc && !handlebars) {
      // Only registers once.
      document.registerElement(EL_NAME, {prototype: Template.prototype});
    }
    
    doc = currentDoc;
    handlebars = handlebars_ref;

    handlebars.registerHelper('pb-for', function(from, to, step, options) {
      if (options === undefined) {
        // Shift the args if step is not defined.
        options = step;
        step = 1;
      }
      let rv = '';
      for (let i = Check(from).isInt().orThrows(); 
          i < Check(to).isInt().orThrows(); 
          i += Check(step).isInt().orThrows()) {
        let data = Handlebars.createFrame(options.data || {});
        data.index = i;
        rv += options.fn(this, { data: data });
      } 
      return rv;
    });
  }
}

Utils.makeGlobal('pb.ui.Template', Template);
