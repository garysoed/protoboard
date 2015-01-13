import Utils from 'src/utils';

/**
 * Utility class to register / unregister events easily.
 *
 * @class Events
 * @static
 */

const TYPES = {
  DOM: 'dom',
  JQUERY: 'jquery'
};

const HANDLERS = {
  [TYPES.DOM]: {
    register: function(action, eventName, handler) {
      action[__element__].addEventListener(eventName, handler);
    },
    unregister: function(action, eventName, handler) {
      action[__element__].removeEventListener(eventName, handler);
    }
  },

  [TYPES.JQUERY]: {
    register: function(action, eventName, handler) {
      $(action[__element__]).on(eventName, handler);
    },
    unregister: function(action, eventName, handler) {
      $(action[__element__]).off(eventName, handler);
    }
  }
};

// Private symbols.
const __element__ = Symbol();
const __scope__ = Symbol();

const __isRegistered__ = Symbol('isRegistered');
const __register__ = Symbol('register');
const __unregister__ = Symbol('unregister');

class Action {

  /**
   * @constructor
   * @param {!Element} element Element to operate on.
   * @param {!Object} scope Scope of the registered events.
   */
  constructor(element, scope) {
    this[__element__] = element;
    
    if (!this[__element__][__scope__]) {
      this[__element__][__scope__] = {};
    }
  }

  /**
   * @method __isRegistered__
   * @param {string} type The type of event to be checked.
   * @param {string} eventName Name of the event to be checked.
   * @param {Function=} handler The function to be checked.
   * @return {Boolean} If handler is given, true iff the handler is registered to the given event
   *     name and type. Otherwise, true iff there is a handler registered to the event name and 
   *     type.
   * @private
   */
  [__isRegistered__](type, eventName, handler) {
    if (!this[__element__][__scope__][type]) {
      return false;
    }

    // TODO(gs): This check is too strict.
    let eventSet = this[__element__][__scope__][type][eventName];
    if (handler) {
      return !!eventSet && eventSet.has(handler);
    } else {
      return !!eventSet && eventSet.size > 0;
    }
  }

  /**
   * Registers the given handler to the given event name for the given type.
   *
   * @method __register__
   * @param {string} type The type of event to register the handler to.
   * @param {string} eventName Name of the event to register the handler to.
   * @param {!Function} handler Handler to be called for the given event.
   * @return {Events} The Events object for chaining.
   * @private
   */
  [__register__](type, eventName, handler) {
    if (this[__isRegistered__](type, eventName, handler)) {
      return this;
    }

    HANDLERS[type].register(this, eventName, handler);

    if (!this[__element__][__scope__][type]) {
      this[__element__][__scope__][type] = {};
    }

    if (!this[__element__][__scope__][type][eventName]) {
      this[__element__][__scope__][type][eventName] = new Set();
    }
    this[__element__][__scope__][type][eventName].add(handler);
    return this;
  }

  /**
   * Unregisters the handlers in the scope for the element.
   *
   * - If type, eventName and handler are given, only the handler listening to that event of that
   *   type will be unregistered.
   * - If only type and eventName are given, all handlers listening to that event name of that type
   *   will be unregistered.
   * - If only type is given, all handlers listening for that type will be unregistered.
   * - If nothing is given, all handlers in the scope will be unregistered.
   *
   * @method __unregister__
   * @param {string=} type Type of event to unregister.
   * @param {string=} eventName If given, all handlers listening to this event will be 
   *     unregistered.
   * @param {Function=} handler Handler to unlisten.
   * @return {!Events} The Events object for chaining.
   * @private
   */
  [__unregister__](type, eventName, handler) {
    if (!type) {
      // Unregisters all events.
      for (let registeredType in this[__element__][__scope__]) {
        this[__unregister__](registeredType);
      }
      return this;
    }

    if (!eventName) {
      // Unregisters all events of the given type.
      for (let event in this[__element__][__scope__][type]) {
        this[__unregister__](type, event);
      }
      return this;
    }

    let eventSet = this[__element__][__scope__][type][eventName];
    if (!eventSet) {
      // Nothing is registered for this event name. Quit immediately.
      return this;
    }

    if (!handler) {
      // Unregisters all handlers for the given event name
      eventSet.forEach(
          registeredHandler => this[__unregister__](type, eventName, registeredHandler));
    } else {
      // Unregister the given event name.
      HANDLERS[type].unregister(this, eventName, handler);
      eventSet.delete(handler);
    }

    return this;
  }

  /**
   * Calls addEventListener to the element, registering the given event name and handler.
   *
   * @method listen
   * @param {string} eventName Name of the event to register the handler to.
   * @param {!Function} handler Handler to be called for the given event.
   * @return {Events} The Events object for chaining.
   */
  listen(eventName, handler) {
    return this[__register__](TYPES.DOM, eventName, handler);
  }

  /**
   * Calls removeEventListener to the element, unregistering the handlers in the scope for the 
   * element.
   *
   * - If eventName and handler are given, only the handler listening to that event will be 
   *   unlistened.
   * - If only eventName is given, all handlers listening to that event name will be unlistened.
   * - If nothing is given, all handlers in the scope will be unlistened.
   *
   * @method unlisten
   * @param {string=} eventName If given, all handlers listening to this event will be 
   *     unlistened.
   * @param {Function=} handler Handler to unlisten.
   * @return {!Events} The Events object for chaining.
   */
  unlisten(eventName, handler) {
    return this[__unregister__](TYPES.DOM, eventName, handler);
  }

  /**
   * @method hasListener
   * @param {string} eventName Name of the event to be checked.
   * @param {Function=} handler The function to be checked.
   * @return {Boolean} If handler is given, true iff the handler is listening to the given event
   *     name. Otherwise, true iff there is a handler registered to the event name.
   */
  hasListener(eventName, handler) {
    return this[__isRegistered__](TYPES.DOM, eventName, handler);
  }

  /**
   * Calls jQuery's on method on the element, registering the given event name and handler.
   *
   * @method on
   * @param {string} eventName Name of the event to register the handler to.
   * @param {!Function} handler Handler to be called for the given event.
   * @return {Events} The Events object for chaining.
   */
  on(eventName, handler) {
    return this[__register__](TYPES.JQUERY, eventName, handler);
  }

  /**
   * Calls jQuery's off method on the element, unregistering the handlers in the scope for the 
   * element.
   *
   * - If eventName and handler are given, only the handler listening to that event will be 
   *   unlistened.
   * - If only eventName is given, all handlers listening to that event name will be unlistened.
   * - If nothing is given, all handlers in the scope will be unlistened.
   *
   * @method off
   * @param {string=} eventName If given, all handlers listening to this event will be 
   *     unlistened.
   * @param {Function=} handler Handler to stop listening to.
   * @return {!Events} The Events object for chaining.
   */
  off(eventName, handler) {
    return this[__unregister__](TYPES.JQUERY, eventName, handler);
  }
}

let Events = {
  /**
   * Creates an Events object that operates on the given element with the given scope.
   *
   * @method of
   * @param  {!Element} element The element to operate on.
   * @param  {!Object} scope Scope of the registered events.
   * @return {!Events} Chainable Events object.
   * @static
   */
  of(element, scope) {
    return new Action(element, scope);
  }
};

export default Events = Events;

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.Events', Events);
  Utils.makeGlobal('pb.Events.Action', Action);
}