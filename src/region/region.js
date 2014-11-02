function handleDragOver(event) {
  event.originalEvent.preventDefault();
  event.originalEvent.dropEffect = 'move';
}

function handleDrop() {

}

export default class Region extends HTMLElement {
  constructor(template) {
    this.doc = doc;
    this.template = template;
  }

  createdCallback() {
    super.createdCallback();
    this.createShadowRoot().appendChild(this.template);
  }

  attachedCallback() {
    super.attachedCallback();
    $(this)
        .on('dragover', handleDragover.bind(this))
        .on('dragenter', e => e.originalEvent.preventDefault() )
        .on('drop', handleDrop.bind(this));
  }
}

document.registerElement('pb-r', {prototype: Region.prototype});