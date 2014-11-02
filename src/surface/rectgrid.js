import Utils from 'src/utils';
import As from 'src/as';

let doc = null;
let templates = null;

/**
 * @class A surface that lays out its components in a grid. To use this, add attributes "row" and
 *     "col" to the element "pb-s-rectgrid". These are the number of rows and columns in the grid.
 *
 *     Add the contents of the grid as children of this element. Use "row" and "col" attributes on
 *     them to indicate their positions in the grid.
 */
export default class RectGrid extends HTMLElement {
  createdCallback() {
    // Create the shadow DOM.
    let shadowRoot = this.createShadowRoot();
    shadowRoot.appendChild(Utils.activateTemplate(templates.main, doc));

    // Initializes the data.
    let rowCount = As.int($(this).attr('row'));
    let colCount = As.int($(this).attr('col'));
    let rootEl = shadowRoot.querySelector('#root');

    // Add the rows.
    for (let row = 0; row < rowCount; row++) {
      rootEl.appendChild(Utils.activateTemplate(templates.row, doc));
    }

    $(shadowRoot.querySelectorAll('#root > div'))
        .each((row, rowEl) => {
          for (let col = 0; col < colCount; col++) {
            let colEl = Utils.activateTemplate(templates.col, doc);
            $(colEl.querySelector('content'))
                .attr('select', `[row="${row}"][col="${col}"]`)
                .attr('row', row)
                .attr('col', col);
            rowEl.appendChild(colEl);
          }
        });
  }

  /**
   * Returns the element at the given row and column, or null if not found.
   * @param  {number} row The row index of the element to be returned.
   * @param  {number} col The col index of the element to be returned.
   * @return {HTMLElement|null} The HTML element at the given row and col, or null if not
   *     found.
   */
  get(row, col) {
    let contentEl = this.shadowRoot .querySelector(`content[row="${row}"][col="${col}"]`);
    return contentEl ? contentEl.getDistributedNodes()[0] : null;
  }

  static register(currentDoc, gridTemplates) {
    doc = currentDoc;
    templates = gridTemplates;

    // TODO: Check if element is registered.
    document.registerElement('pb-s-rectgrid', {prototype: RectGrid.prototype});
  }
}

if (!window.pb) {
  window.pb = {};
}

window.pb.RectGrid = RectGrid;
