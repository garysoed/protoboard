import Utils from 'src/utils';

let activeContext = null;

/**
 * Service that manages the context menu in the app.
 *
 * @class service.Context
 * @static
 */
let Context = {

  /**
   * Sets the given element as the currently active context menu.
   *
   * @method setActive
   * @param {Object} active The currently active context menu.
   */
  setActive(active) {
    activeContext = active;
    $(this).trigger(this.EventType.SWITCHED);
  },

  /**
   * @method getActive
   * @return {Object} The currently active context menu, if any.
   */
  getActive() {
    return activeContext;
  },

  EventType: {
    /**
     * Event type fired when the context menu that is opened has switched
     *
     * @type string
     * @property EventType.SWITCHED
     */
    SWITCHED: 'context-switched'
  }
};

export default Context = Context;

Utils.makeGlobal('pb.service.Context', Context);
