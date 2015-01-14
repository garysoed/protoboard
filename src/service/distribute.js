import Utils from 'src/utils';

let source = null;

const CLASS_DISTRIBUTE = 'pb-distribute';

/**
 * Service that manages the distributing action.
 *
 * @class service.Distribute
 * @static
 */
let Distribute = {

  /**
   * Starts the distribution action.
   *
   * @method begin
   * @param {!Element} distributeSource Source to distribute the elements from.
   */
  begin(distributeSource) {
    if (!this.isActive()) {
      source = distributeSource;
      distributeSource.classList.add(CLASS_DISTRIBUTE);
      $(this).trigger(this.EventType.BEGIN);
    }
  },

  /**
   * Ends the distribution process.
   *
   * @method end
   */
  end() {
    if (this.isActive()) {
      source.classList.remove(CLASS_DISTRIBUTE);
      source = null;
      $(this).trigger(this.EventType.END);
    }
  },

  /**
   * @method isActive
   * @return {boolean} True iff the distribution is active.
   */
  isActive() {
    return source !== null;
  },

  /**
   * @method next
   * @return {Element} The first child of the distribution source.
   */
  next() {
    return source.next();
  },

  // TODO(gs): Rename to Events
  EventType: {
    /**
     * Event type dispatched when the distribution is starting.
     *
     * @property EventType.BEGIN
     * @type string
     */
    BEGIN: 'distribute-begin',

    /**
     * Event type dispatched when the distribution is ending.
     *
     * @property EventType.END
     * @type string
     */
    END: 'distribute-end'
  }
};

$(window).on('keydown', event => {
  // Check if this is ESC key.
  if (event.which === 27 && Distribute.isActive()) {
    Distribute.end();
  }
});

export default Distribute = Distribute;

Utils.makeGlobal('pb.service.Distribute', Distribute);