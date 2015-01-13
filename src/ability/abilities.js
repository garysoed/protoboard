import Triggerable from 'src/ability/triggerable';
import Utils       from 'src/utils';

// Private symbols.
const __register__ = Symbol();

const __abilities__ = Symbol();


/**
 * Entry point to add any abilities to custom elements. Note that this only works on custom
 * elements.
 *
 * @class ability.Abilities
 * @static
 */
const Abilities = {

  /**
   * Registers the given ability to the given constructor.
   *
   * @method __register__
   * @param {!Object} ctorProto The prototype of the constructor to register to.
   * @param {!ability.Ability} ability The ability to register.
   * @private
   * @static
   */
  [__register__](ctorProto, ability) {
    Utils.extendFn(
        ctorProto,
        'createdCallback',
        function() {
          if (!this[__abilities__]) {
            this[__abilities__] = {};
          }
          this[__abilities__][ability.name] = ability;
          ability.setDefaultValue.call(ability, this);
        });
    Utils.extendFn(
        ctorProto, 
        'attributeChangedCallback', 
        function(name, oldValue, newValue) {
          ability.attributeChangedCallback.call(ability, this, name, oldValue, newValue);
        });
    Utils.extendFn(
        ctorProto, 
        'attachedCallback', 
        function() {
          ability.attachedCallback.call(ability, this);
        });
    Utils.extendFn(
        ctorProto, 
        'detachedCallback', 
        function() {
          ability.detachedCallback.call(ability, this);
        }, 
        true /* callBefore */);
  },

  /**
   * Configures the given constructor to add abilities. This only works if the constructor is used
   * for custom elements.
   *
   * Look at other classes in ability module to see what are supported.
   *
   * @method config
   * @param {!Function} ctor Constructor of the element to add the abilities to.
   * @param {!Map.<string, ability.Ability>} cfg Map with the trigger type as the key, and ability
   *    to be triggered as the value.
   * @param {ability.Ability} [...abilities] Other abilities to register.
   * @static
   */
  config(ctor, cfg, ...abilities) {
    let ctorProto = ctor.prototype;
    let triggerConfig = {};
    // collect the known abilities.
    let knownAbilities = new Set();

    // Get from config
    for (let key in cfg) {
      let ability = cfg[key];
      knownAbilities.add(ability);
      this[__register__](ctorProto, ability);
      triggerConfig[key] = ability.name;
    }

    // Get from the rest of abilities
    for (let ability of abilities) {
      knownAbilities.add(ability);
      this[__register__](ctorProto, ability);
    }

    this[__register__](ctorProto, new Triggerable(triggerConfig, knownAbilities));

    return ctor;
  }
};

export default Abilities;

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.ability.Abilities', Abilities);
}
