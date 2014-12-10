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
  config(ctor, cfg) {
    for (let pair of cfg) {
      let ability = pair[0];
      Utils.extendFn(
          ctor.prototype,
          'createdCallback',
          function() {
            ability.setDefaultValue.call(this, pair[1]);
          });
      Utils.extendFn(
          ctor.prototype, 
          'attributeChangedCallback', 
          ability.attributeChangedCallback);
      Utils.extendFn(
          ctor.prototype, 
          'attachedCallback', 
          ability.attachedCallback);
      Utils.extendFn(
          ctor.prototype, 
          'detachedCallback', 
          ability.detachedCallback, 
          true /* callBefore */);
    }
    return ctor;
  }
};

export default Abilities;

if (window['TEST_MODE']) {
  Utils.makeGlobal('pb.ability.Abilities', Abilities);
}
