import Utils from 'src/utils';

/**
 * Entry point to add any abilities to custom elements. Note that this only works on custom
 * elements.
 *
 * @class ability.Abilities
 * @static
 */
const Abilities = {

  /**
   * Configures the given constructor to add abilities. This only works if the constructor is used
   * for custom elements.
   *
   * Look at other classes in ability module to see what are supported.
   * 
   * @param {!Function} ctor Constructor of the element to add the abilities to.
   * @param {!Map.<Ability, Object>} cfg Map with the Ability as the key, and a default value object
   *     specific to that ability. Check the Ability's documentation for more information.
   */
  config(ctor, ...abilities) {
    for (let ability of abilities) {
      // TODO: Curry the functions.
      Utils.extendFn(
          ctor.prototype,
          'createdCallback',
          function() {
            ability.setDefaultValue.call(ability, this);
          });
      Utils.extendFn(
          ctor.prototype, 
          'attributeChangedCallback', 
          function(name, oldValue, newValue) {
            ability.attributeChangedCallback.call(ability, this, name, oldValue, newValue);
          });
      Utils.extendFn(
          ctor.prototype, 
          'attachedCallback', 
          function() {
            ability.attachedCallback.call(ability, this);
          });
      Utils.extendFn(
          ctor.prototype, 
          'detachedCallback', 
          function() {
            ability.detachedCallback.call(ability, this);
          }, 
          true /* callBefore */);
    }
    return ctor;
  }
};

export default Abilities;

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.ability.Abilities', Abilities);
}
