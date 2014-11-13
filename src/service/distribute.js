import Utils from 'src/utils';

let source = null;

const CLASS_DISTRIBUTE = 'pb-distribute';

/**
 * Service that manages the distributing action.
 *
 * @type {Object}
 */
let Distribute = {

  /**
   * Starts the distribution action.
   * @param {!Bag} distributeSource Source to distribute the elements from.
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
   */
  end() {
    if (this.isActive()) {
      source.classList.remove(CLASS_DISTRIBUTE);
      source = null;
      $(this).trigger(this.EventType.END);
    }
  },

  /**
   * @return {boolean} True iff the distribution is active.
   */
  isActive() {
    return source !== null;
  },

  /**
   * @return {Element} The first child of the distribution source.
   */
  next() {
    return source.next();
  },

  /**
   * Types of events that can be fired by the service
   *
   * @enum {string}
   */
  EventType: {
    BEGIN: 'distribute-begin',
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