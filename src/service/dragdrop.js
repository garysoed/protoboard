import Utils from 'src/utils';

/**
 * Service that keeps track of drag and drop.
 *
 * @type {Object}
 */
let DragDrop = {
  lastDraggedEl: null,

  /**
   * Start dragging the given element.
   * @param {!Element} draggedEl The element that is dragged.
   */
  dragStart(draggedEl) {
    this.lastDraggedEl = draggedEl;
  }
};


export default DragDrop = DragDrop;

Utils.makeGlobal('pb.service.DragDrop', DragDrop);
