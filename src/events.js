import Utils from 'src/utils';

/**
 * Utility class to register / unregister events easily.
 *
 * @class Events
 * @static
 */

// Private symbols.
const __element__ = Symbol();
const __scope__ = Symbol();
const __handlers__ = Symbol();

class Action {

  /**
   * @constructor
   * @param  {!Element} element Element to operate on.
   * @param  {!Object} scope Scope of the registered events.
   */
  constructor(element, scope) {
    this[__element__] = element;
    
    if (!this[__element__][__scope__]) {
      this[__element__][__scope__] = {};
    }
  }

  /**
   * @method isRegistered
   * @param  {string} eventName Name of the event to be checked.
   * @param  {Function=} handler The function to be checked.
   * @return {Boolean} If handler is given, true iff the handler is registered to the given event
   *     name. Otherwise, true iff there is a handler registered to the event.
   */
  isRegistered(eventName, handler) {
    let eventSet = this[__element__][__scope__][eventName];
    return handler ? !!eventSet && eventSet.has(handler) : !!eventSet;
  }

  /**
   * Registers the given handler to the given event.
   *
   * @method register
   * @param  {string} eventName Name of event to listen to.
   * @param  {!Function} handler Handler to be called for the given event.
   * @return {Events} The Events object for chaining.
   */
  register(eventName, handler) {
    if (this.isRegistered(eventName, handler)) {
      return this;
    }

    this[__element__].addEventListener(eventName, handler);

    if (!this[__element__][__scope__][eventName]) {
      this[__element__][__scope__][eventName] = new Set();
    }
    this[__element__][__scope__][eventName].add(handler);
    return this;
  }

  /**
   * Unregisters the handlers in the scope for the element.
   *
   * - If eventName and handler are given, only the handler listening to that event will be
   * unregistered.
   * - If only eventName is given, all handlers listening to that event name will be unregistered.
   * - If no eventName is given, all handlers in the scope will be unregistered.
   *
   * @param  {string=} eventName If given, all handlers listening to this event will be 
   *     unregistered.
   * @param  {Function=} handler Handler to unregister.
   * @return {!Events} The Events object for chaining.
   */
  unregister(eventName, handler) {
    if (!eventName) {
      // Unregisters all events.
      for (let event in this[__element__][__scope__]) {
        this.unregister(event);
      }
      return this;
    }

    let eventSet = this[__element__][__scope__][eventName];
    if (!eventSet) {
      // Nothing is registered for this event name. Quit immediately.
      return this;
    }

    if (!handler) {
      // Unregisters all handlers for the given event name
      eventSet.forEach(registeredHandler => this.unregister(eventName, registeredHandler));
    } else {
      // Unregister the given event name.
      this[__element__].removeEventListener(eventName, handler);
      eventSet.delete(handler);
    }

    return this;
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
}
