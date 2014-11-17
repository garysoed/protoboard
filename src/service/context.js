import Utils from 'src/utils';

let activeContext = null;

/**
 * Service that manages the context menu in the app.
 */
let Context = {

  /**
   * Sets the given element as the currently active context menu.
   * @param {Object} active The currently active context menu.
   */
  setActive(active) {
    activeContext = active;
    $(this).trigger(this.EventType.SWITCHED);
  },

  /**
   * @return {Object} The currently active context menu, if any.
   */
  getActive() {
    return activeContext;
  },

  /**
   * Types of events that can be fired by the service.
   *
   * @enum {string}
   */
  EventType: {
    SWITCHED: 'context-switched'
  }
};

export default Context = Context;

Utils.makeGlobal('pb.service.Context', Context);
