// Private symbols.
const __values__ = Symbol('values');

const SEPARATOR = '_';

class BindingTree {

  /**
   * Represents a tree of bound values keyed by binding key.
   * @class DI.BindingTree
   * @constructor
   */
  constructor() {
    this[__values__] = new Map();
  }

  /**
   * Adds the given key and value to the tree. The tree will try to bind using the last segment of
   * the key. If this causes a conflict, it will create a subtree.
   *
   * @method add
   * @param {string} key The key to bind the value to.
   * @param {Object} value The value to be bound.
   * @param {number} [depth=0] The depth of the key to use as binding key. This should not be
   *    called from outside the class.
   */
  add(key, value, depth = 0) {
    // TODO(gs): Remove the separator
    let segments = key.split(SEPARATOR);
    let bindingKey = segments[segments.length - 1 - depth];

    if (!this[__values__].has(bindingKey)) {
      this[__values__].set(bindingKey, {
        key: key,
        value: value
      });
    } else {
      // There is already a value corresponding to this key
      let existingValue = this[__values__].get(bindingKey);
      if (existingValue.key === key) {
        throw `Key ${key} is already bound`;
      }

      let newTree = new BindingTree();
      this[__values__].set(bindingKey, newTree);
      newTree.add(existingValue.key, existingValue.value, depth + 1);
      newTree.add(key, value, depth + 1);
    }
  }

  /**
   * Returns the value corresponding to the given key.
   *
   * @param {string} key Key of the value to return.
   * @param {number} [depth=0] The depth of the key to use as binding key. This should not be
   *    called from outside the class.
   * @return {any} The bound value, or undefined if the value cannot be found, or if the key has
   *    collision but collision cannot be resolved.
   */
  get(key, depth = 0) {
    let segments = key.split(SEPARATOR);
    let bindingKey = segments[segments.length - 1 - depth];

    if (bindingKey === undefined) {
      return undefined;
    }

    if (!this[__values__].has(bindingKey)) {
      return undefined;
    }

    let value = this[__values__].get(bindingKey);
    if (value instanceof BindingTree) {
      return value.get(key, depth + 1);
    } else {
      return value.value;
    }
  }
}

export default BindingTree;