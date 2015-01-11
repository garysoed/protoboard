import Utils  from 'src/utils';

import Ability from 'src/ability/ability';

/**
 * Provides decorator to show context menu on an element. To use this, pass a configuration object
 * into the constructor. The configuration object determines the structure of the menu. The key of
 * the object is the label to be shown on the menu. The value can be any of the following:
 * - ability.Ability object: This will display the label as a menu item which triggers the ability
 *   when clicked.
 * - undefined: This will display a horizontal line. The label's value is ignored.
 * - Configuration object: This will use the label as a menu item to open a submenu specified by the
 *   given configuration.
 *
 * TODO(gs): Maybe change the config to take an array of objects?
 *
 * @class ability.Contextable
 * @static
 * @extends ability.Ability
 */

// Private symbols.
const __abilities__ = Symbol();
const __createMenuEl__ = Symbol();
const __currentEl__ = Symbol('currentEl');
const __menuEl__ = Symbol('menuEl');
const __onShow__ = Symbol();
const __trigger__ = Symbol();

export default class Contextable extends Ability {


  /**
   * @constructor
   * @param {Object} config The configuration object to describe the menu. See the class' 
   *    description for this.
   */
  constructor(config) {
    this[__menuEl__] = this[__createMenuEl__](config);
    this[__currentEl__] = null;
  }

  [__createMenuEl__](config) {
    let menuEl = document.createElement('menu');
    $(menuEl).attr('type', 'context');

    for (let label in config) {
      let value = config[label];
      let child = null;
      if (value instanceof Ability) {
        // Create a simple menu item.
        child = document.createElement('menuitem');
        $(child).attr('label', label);
        child.addEventListener('click', this[__trigger__].bind(this, value));
      } else if (value === undefined) {
        // Create a horizontal line.
        child = document.createElement('hr');
      } else if (value instanceof Object) {
        // Create a submenu.
        child = this[__createMenuEl__](value);
        $(child).attr('label', label);
      } else {
        throw `Item with label ${label} is invalid`;
      }

      menuEl.appendChild(child);
    }
    return menuEl;
  }

  [__trigger__](ability) {
    ability.trigger(this[__currentEl__]);
  }

  [__onShow__](config) {
    this[__currentEl__] = config['pb-el'];
  }

  /**
   * Creates the context menu and append it to the element.
   *
   * @method setDefaultValue
   * @param {!Element} el The element whose default value should be set.
   */
  setDefaultValue(el) {
    let tmpId = Math.random();
    // TODO(gs): Hack since the plugin only accepts CSS selector
    $(el).attr('pb-id', tmpId);
    $.contextMenu({
      className: 'pb-contextable',
      selector: `[pb-id="${tmpId}"]`,
      items: $.contextMenu.fromMenu(this[__menuEl__]),
      events: {
        show: this[__onShow__].bind(this)
      },
      'pb-el': el
    });

    // TODO(gs): Disable item if ability is disabled.
  }

  /**
   * The name of the ability.
   * 
   * @attribute name
   * @type string
   */
  get name() {
    return 'pb-contextable';
  }
}

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.ability.Contextable', Contextable);
}
