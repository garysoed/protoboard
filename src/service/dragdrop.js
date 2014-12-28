import Utils from 'src/utils';

// Private symbols
const __lastDraggedEl__ = Symbol();
const __offsetX__ = Symbol();
const __offsetY__ = Symbol();

/**
 * Service that keeps track of drag and drop.
 *
 * @class service.DragDrop
 */
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
  },

  /**
   * Last element that was dragged.
   *
   * @property lastDraggedEl
   * @type Element
   * @readOnly
   */
  get lastDraggedEl() {
    return this[__lastDraggedEl__];
  },

  /**
   * The x offset from the mouse cursor to the top left edge of the element being dragged.
   *
   * @property offsetX
   * @type number
   * @readOnly
   */
  get offsetX() {
    return this[__offsetX__];
  },

  /**
   * The y offset from the mouse cursor to the top left edge of the element being dragged.
   *
   * @property offsetY
   * @type number
   * @readOnly
   */
  get offsetY() {
    return this[__offsetY__];
  }
};


export default DragDrop = DragDrop;

Utils.makeGlobal('pb.service.DragDrop', DragDrop);
