import Utils from 'src/utils';

let template = null;
let doc = null;

let EL_NAME = "pb-u-context";

let SHOWN_CLASS = "shown";
// TODO: Make subcontext

/**
 * Handles context menu on the parent element.
 *
 * @param {!Event} event The event object.
 */
function handleContextMenu(event) {
  this.show(event.x, event.y);
  event.preventDefault();
}

/**
 * Handles click event in a document.
 *
 * @param {!Event} event The event object
 * @private
 */
function handleClick(event) {
  if (!this.contains(event.target)) {
    this.hide();
  }
}

/**
 * @class Creates a context menu.
 */
class Context extends HTMLElement {
  constructor() {}

  createdCallback() {
    this.createShadowRoot()
        .appendChild(Utils.activateTemplate(template, doc));
    this.attachedCallback();
    document.addEventListener('click', handleClick.bind(this));
  }

  attachedCallback() {
    if (this.parentElement) {
      this.parentElement.addEventListener('contextmenu', handleContextMenu.bind(this));
    }
  }

  show(mouseX, mouseY) {
    let rootEl = this.shadowRoot.querySelector('#root');

    // Do nothing if it is already shown.
    if (rootEl.classList.contains(SHOWN_CLASS)) {
      return;
    }

    rootEl.classList.add(SHOWN_CLASS);

    // Handle positioning.
    let x = null;
    let hAnchor = null;
    let documentEl = this.ownerDocument.documentElement;
    if (mouseX + rootEl.clientWidth > documentEl.clientWidth) {
      hAnchor = 'right';
      x = documentEl.clientWidth - mouseX;
    } else {
      hAnchor = 'left';
      x = mouseX;
    }

    let y = null;
    let vAnchor = null;
    if (mouseY + rootEl.clientHeight > documentEl.clientHeight) {
      vAnchor = 'bottom';
      y = documentEl.clientHeight - mouseY;
    } else {
      vAnchor = 'top';
      y = mouseY;
    }

    this.style.position = 'fixed';

    // Clear the positions.
    this.style.top = '';
    this.style.left = '';
    this.style.right = '';
    this.style.bottom = '';

    this.style[hAnchor] = `${x}px`;
    this.style[vAnchor] = `${y}px`;
  }

  /**
   * Hides the context menu.
   */
  hide() {
    this.shadowRoot.querySelector('#root').classList.remove(SHOWN_CLASS);
  }

  static register(currentDoc, contextTemplate) {
    if (doc || template) {
      // Register has already happened.
      return;
    }

    doc = currentDoc;
    template = contextTemplate;

    document.registerElement(EL_NAME, { prototype: Context.prototype });
  }
}

export default Context = Context;

Utils.makeGlobal('pb.ui.Context', Context);