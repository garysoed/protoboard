import Utils from 'src/utils';

/**
 * Service that keeps track of drag and drop.
 *
 * @class service.DragDrop
 * @static
 */

// Private symbols
const __lastDraggedEl__ = Symbol();
const __offsetX__ = Symbol();
const __offsetY__ = Symbol();

let DragDrop = {

  [__lastDraggedEl__]: null,

  /**
   * Start dragging the given element.
   *
   * @method dragStart
   * @param {!Element} draggedEl The element that is dragged.
   * @param {number} offsetX The x offset from the mouse cursor to the top left edge of the element
   *     being dragged.
   * @param {number} offsetY The y offset from the mouse cursor to the top left edge of the element
   *     being dragged.
   */
  dragStart(draggedEl, offsetX, offsetY) {
    this[__lastDraggedEl__] = draggedEl;
    this[__offsetX__] = offsetX;
    this[__offsetY__] = offsetY;
    $(this).trigger(DragDrop.Events.LAST_DRAGGED_EL_CHANGED);
  },

  /**
   * Ends the drag process.
   *
   * @method dragEnd
   */
  dragEnd() {
    this[__lastDraggedEl__] = null;
    this[__offsetX__] = undefined;
    this[__offsetY__] = undefined;
    $(this).trigger(DragDrop.Events.LAST_DRAGGED_EL_CHANGED);
  },

  /**
   * Last element that was dragged.
   *
   * @property lastDraggedEl
   * @type Element
   * @readonly
   */
  get lastDraggedEl() {
    return this[__lastDraggedEl__];
  },

  /**
   * The x offset from the mouse cursor to the top left edge of the element being dragged.
   *
   * @property offsetX
   * @type number
   * @readonly
   */
  get offsetX() {
    return this[__offsetX__];
  },

  /**
   * The y offset from the mouse cursor to the top left edge of the element being dragged.
   *
   * @property offsetY
   * @type number
   * @readonly
   */
  get offsetY() {
    return this[__offsetY__];
  }
};

DragDrop.Events = {
  /**
   * Type of event dispatched when the last element that was dragged has changed.
   *
   * @property Events.LAST_DRAGGED_EL_CHANGED
   * @type string
   */
  LAST_DRAGGED_EL_CHANGED: 'dragdrop-last_dragged_el_changed'
};

export default DragDrop = DragDrop;

Utils.makeGlobal('pb.service.DragDrop', DragDrop);
