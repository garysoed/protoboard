import Utils from 'src/utils';

/**
 * Service that keeps track of drag and drop.
 *
 * @class service.DragDrop
 */
let DragDrop = {

  /**
   * Last element that was dragged.
   *
   * @type Element
   * @property lastDraggedEl
   */
  lastDraggedEl: null,

  /**
   * Start dragging the given element.
   *
   * @method dragStart
   * @param {!Element} draggedEl The element that is dragged.
   */
  dragStart(draggedEl) {
    this.lastDraggedEl = draggedEl;
  }
};


export default DragDrop = DragDrop;

Utils.makeGlobal('pb.service.DragDrop', DragDrop);
