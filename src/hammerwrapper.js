import Utils from 'src/utils';

/**
 * Wrapper around Hammer JS.
 * 
 * @class pb.HammerWrapper
 * @static
 */

// Private symbols
const __hammer__ = Symbol();
const __getHammer__ = Symbol();

let HammerWrapper = {

  /**
   * Creates a new Hammer object, or return a cached one if one already exists.
   *
   * @method __getHammer__
   * @param {!Element} el The element associated with the Hammer JS object.
   * @return {!Hammer} The Hammer JS object.
   * @private
   */
  [__getHammer__](el) {
    if (!el[__hammer__]) {
      // TODO(gs): This is not set if the script runs in HTML import.
      if (!el.ownerDocument.parentWindow) {
        el.ownerDocument.parentWindow = window;
      }

      let hammer = new Hammer.Manager(el);
      hammer.add(new Hammer.Tap({ event: 'doubletap', taps: 2, interval: 300 }));
      hammer.add(new Hammer.Tap({ event: 'singletap', }));

      hammer.get('doubletap').recognizeWith('singletap');
      hammer.get('singletap').requireFailure('doubletap');
      el[__hammer__] = hammer;

    }
    return el[__hammer__];
  },

  /**
   * Registers the given gesture to the given element and handler.
   * 
   * @method on
   * @param {!Element} el The element to register.
   * @param {string} gestureType The type of Hammer JS gesture to register.
   * @param {!Function} handler The handler function to register.
   */
  on(el, gestureType, handler) {
    this[__getHammer__](el).on(gestureType, handler);
  },

  /**
   * Unregisters the given gesture from the given element and handler.
   *
   * @method off
   * @param {!Element} el Element to unregister from.
   * @param {string} gestureType Type of Hammer JS gesture to register.
   * @param {!Function} handler The handler function to unregister.
   */
  off(el, eventType, handler) {
    this[__getHammer__](el).on(eventType, handler);
  }
};

export default HammerWrapper = HammerWrapper;

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.HammerWrapper', HammerWrapper);
}
