import Check     from 'src/check';
import PbElement from 'src/pbelement';
import Utils     from 'src/utils';

let doc = null;
let templates = null;

const ATTR_ROW = 'pb-row';
const ATTR_COL = 'pb-col';
const EL_NAME = 'pb-s-rectgrid';

/**
 * A surface that lays out its components in a grid. To use this, add attributes `pb-row` and
 * `pb-col` to the element `pb-s-rectgrid`. These are the number of rows and columns in the grid.
 *
 * Add the contents of the grid as children of this element. Use `pb-row` and `pb-col` attributes on
 * them to indicate their positions in the grid.
 *
 * @class surface.RectGrid
 * @extends PbElement
 */
export default class RectGrid extends PbElement {

  /**
   * Called when the element is created
   *
   * @method createdCallback
   */
  createdCallback() {
    super.createdCallback();

    // Create the shadow DOM.
    this.createShadowRoot()
        .appendChild(Utils.activateTemplate(templates.main, doc));

    // Initializes the data.
    let rowCount = Check($(this).attr(ATTR_ROW)).isInt().orThrows();
    let colCount = Check($(this).attr(ATTR_COL)).isInt().orThrows();
    let rootEl = this.shadowRoot.querySelector('#content');

    // Add the rows.
    for (let row = 0; row < rowCount; row++) {
      rootEl.appendChild(Utils.activateTemplate(templates.row, doc));
    }

    $(this.shadowRoot.querySelectorAll('#content > div'))
        .each((row, rowEl) => {
          for (let col = 0; col < colCount; col++) {
            let colEl = Utils.activateTemplate(templates.col, doc);
            $(colEl.querySelector('content'))
                .attr('select', `[${ATTR_ROW}="${row}"][${ATTR_COL}="${col}"]`)
                .attr(ATTR_ROW, row)
                .attr(ATTR_COL, col);
            rowEl.appendChild(colEl);
          }
        });
  }

  /**
   * Returns the element at the given row and column, or null if not found.
   *
   * @method get
   * @param {number} row The row index of the element to be returned.
   * @param {number} col The col index of the element to be returned.
   * @return {HTMLElement|null} The HTML element at the given row and col, or null if not
   *     found.
   */
  get(row, col) {
    let contentEl = this.shadowRoot
        .querySelector(`content[${ATTR_ROW}="${row}"][${ATTR_COL}="${col}"]`);
    return contentEl ? contentEl.getDistributedNodes()[0] : null;
  }

  /**
   * Registers `pb-s-rectgrid` to the document.
   *
   * @method register
   * @param {!Document} currentDoc The document object to register the element to.
   * @param {!Object} gridTemplates Object containing template for the `pb-s-rectgrid`'s element 
   *     shadow DOM.
   * @param {!Element} gridTemplates.main The main template for the element.
   * @param {!Element} gridTemplates.row The template for every row in the grid.
   * @param {!Element} gridTemplates.col The template for every column in the grid.
   * @static
   */
  static register(currentDoc, gridTemplates) {
    if (doc || templates) {
      // Register has already happened.
      return;
    }

    doc = currentDoc;
    templates = gridTemplates;

    document.registerElement(EL_NAME, {prototype: RectGrid.prototype});
  }
}

Utils.makeGlobal('pb.surface.RectGrid', RectGrid);
