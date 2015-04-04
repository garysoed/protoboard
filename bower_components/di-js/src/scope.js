import BindingTree from './bindingtree';
import Provider from './provider';
import Globals from './globals';


// Private symbols.
const __localBindings__ = Symbol('localBindings');
const __parentScope__ = Symbol('parentScope');
const __prefix__ = Symbol('prefix');

const __createProvider__ = Symbol();

const __get__ = Globals.get;
const bindings = Globals.bindings;

class Scope {
  /**
   * Scope containing local bindings.
   *
   * @class DI.Scope
   * @constructor
   * @param {DI.Scope} [parentScope=null] The parent scope.
   */
  constructor(parentScope = null, prefix = '') {
    this[__localBindings__] = new BindingTree();
    this[__parentScope__] = parentScope;
    this[__prefix__] = prefix;
  }

  [__createProvider__](value, name = null) {
    let fn = value.splice(value.length - 1)[0];
    return new Provider(fn, value, this[__prefix__], this, name);
  }

  [__get__](key, scope) {
    let provider = this[__localBindings__].get(key);
    if (provider === undefined) {
      if (this[__parentScope__]) {
        return this[__parentScope__][__get__](key, scope);
      } else {
        return undefined;
      }
    } else {
      return provider.resolve(scope);
    }
  }

  /**
   * Creates a new child scope with the given value bound to the given key in its local binding.
   *
   * @method with
   * @param {string} key The key to bound the value to.
   * @param {Function} fn The function to run. The function's arguments will be bound based on
   *    their names.
   * @return {DI.Scope} The newly created child scope.
   */
  with(key, value) {
    let childScope = new Scope(this, this[__prefix__]);
    childScope[__localBindings__]
        .add(append(this[__prefix__], key), this[__createProvider__](value, key));
    return childScope;
  }

  /**
   * Creates a new child scope with the given value bound to the given key in its local binding.
   * This is similar to {{#crossLink "DI.Scope/with"}}{{/crossLink}}, but the value is a constant.
   *
   * @method constant
   * @param {string} key The key to bound the value to.
   * @param {Object} value The object to bind to the given key.
   * @return {DI.Scope} The newly created child scope.
   */
  constant(key, value) {
    return this.with(key, [() => value]);
  }

  /**
   * Globally binds the given value to the given key.
   *
   * @method bind
   * @param {string} key The key to bound the value to.
   * @param {Function} fn The function to run. The function's arguments will be bound based on
   *    their names.
   */
  bind(key, value) {
    bindings.add(append(this[__prefix__], key), this[__createProvider__](value, key));
    return this;
  }

  /**
   * Returns the provider bound to the given key and resolve it in this scope. This will first check
   * for the local bindings, then its ancestors. If no binding is found in the ancestral path, this
   * will check for the global bindings.
   *
   * @method get
   * @param {string} key Key whose bound value should be returned.
   * @return {any} The value bound to the given key, or undefined if no values can be found.
   */
  get(key) {
    let value = this[__get__](append(this[__prefix__], key));
    if (value === undefined) {
      return Globals.getGlobal(key, this);
    } else {
      return value;
    }
  }

  /**
   * Runs the given function after injecting any dependencies.
   *
   * @method run
   * @param {Function} fn The function to run. The function's arguments will be bound based on
   *    their names.
   */
  run(fn) {
    this[__createProvider__](fn).resolve(this);
  }

  /**
   * Prefix any keys given to this scope with the given prefix.
   *
   * @method prefix
   * @param {string} prefix The prefix to add.
   * @return {DI.Scope} The newly created child scope with the given prefix.
   */
  prefix(prefix) {
    return new Scope(this, append(prefix, this[__prefix__]));
  }
}

function append(l, r) {
  return [l, r].filter(i => !!i).join('.');
}

export default Scope;