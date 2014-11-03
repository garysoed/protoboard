/**
 * Service that keeps track of drag and drop.
 *
 * @type {Object}
 */
let DragDrop = {
  EventType: {
    DRAGGED: 'dragged'
  },

  lastDraggedEl: null,

  /**
   * Start dragging the given element.
   * @param {!Element} draggedEl The element that is dragged.
   */
  dragStart(draggedEl) {
    this.lastDraggedEl = draggedEl;
    $(this).trigger(this.EventType.DRAGGED, draggedEl);
  }
};


export default DragDrop = DragDrop;

if (!window.pb) {
  window.pb = {};
}

window.pb.DragDrop = DragDrop;
