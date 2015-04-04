(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// Private symbols.
var __values__ = Symbol("values");

var SEPARATOR = "_";

var BindingTree = (function () {

  /**
   * Represents a tree of bound values keyed by binding key.
   * @class DI.BindingTree
   * @constructor
   */

  function BindingTree() {
    _classCallCheck(this, BindingTree);

    this[__values__] = new Map();
  }

  _createClass(BindingTree, {
    add: {

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

      value: function add(key, value) {
        var depth = arguments[2] === undefined ? 0 : arguments[2];

        // TODO(gs): Remove the separator
        var segments = key.split(SEPARATOR);
        var bindingKey = segments[segments.length - 1 - depth];

        if (!this[__values__].has(bindingKey)) {
          this[__values__].set(bindingKey, {
            key: key,
            value: value
          });
        } else {
          // There is already a value corresponding to this key
          var existingValue = this[__values__].get(bindingKey);
          if (existingValue.key === key) {
            throw "Key " + key + " is already bound";
          }

          var newTree = new BindingTree();
          this[__values__].set(bindingKey, newTree);
          newTree.add(existingValue.key, existingValue.value, depth + 1);
          newTree.add(key, value, depth + 1);
        }
      }
    },
    get: {

      /**
       * Returns the value corresponding to the given key.
       *
       * @param {string} key Key of the value to return.
       * @param {number} [depth=0] The depth of the key to use as binding key. This should not be
       *    called from outside the class.
       * @return {any} The bound value, or undefined if the value cannot be found, or if the key has
       *    collision but collision cannot be resolved.
       */

      value: function get(key) {
        var depth = arguments[1] === undefined ? 0 : arguments[1];

        var segments = key.split(SEPARATOR);
        var bindingKey = segments[segments.length - 1 - depth];

        if (bindingKey === undefined) {
          return undefined;
        }

        if (!this[__values__].has(bindingKey)) {
          return undefined;
        }

        var value = this[__values__].get(bindingKey);
        if (value instanceof BindingTree) {
          return value.get(key, depth + 1);
        } else {
          return value.value;
        }
      }
    }
  });

  return BindingTree;
})();

module.exports = BindingTree;

},{}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var BindingTree = _interopRequire(require("./bindingtree"));

var Globals = {
  get: Symbol("get"),

  getGlobal: function getGlobal(key, scope) {
    var globalProvider = this.bindings.get(key);
    if (globalProvider === undefined) {
      return undefined;
    } else {
      return globalProvider.resolve(scope);
    }
  },

  bindings: new BindingTree()
};

module.exports = Globals;

},{"./bindingtree":1}],3:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var BindingTree = _interopRequire(require("./bindingtree"));

var Globals = _interopRequire(require("./globals"));

var Provider = _interopRequire(require("./provider"));

var Scope = _interopRequire(require("./scope"));

(function (window) {
  window.DI = new Scope();

  window.DI.BindingTree = BindingTree;
  window.DI.Provider = Provider;
  window.DI.Scope = Scope;
  window.DI.bindings = Globals.bindings;
})(window);

},{"./bindingtree":1,"./globals":2,"./provider":4,"./scope":5}],4:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Globals = _interopRequire(require("./globals"));

var __get__ = Globals.get;

// Private symbols.
var __function__ = Symbol();
var __localScope__ = Symbol("localScope");
var __name__ = Symbol();
var __prefix__ = Symbol("prefix");
var __keys__ = Symbol();
var __resolvedValues__ = Symbol();

var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

var Provider = (function () {

  /**
   * @class DI.Provider
   * @constructor
   * @param {Function} fn The function whose arguments should be resolved. The names will be used as
   *    the key.
   * @param {Array} keys Array of keys for the given function's argument's names.
   * @param {string} prefix The prefix to use for the keys.
   * @param {DI.Scope} localScope The local scope. This will be prioritized when checking for bound
   *    values.
   * @param {string} [name=null] Reference name of the provider. This is used for detecting cyclic
   *    dependencies.
   */

  function Provider(fn, keys, prefix, localScope) {
    var name = arguments[4] === undefined ? null : arguments[4];

    _classCallCheck(this, Provider);

    this[__function__] = fn;
    this[__keys__] = keys;
    this[__prefix__] = prefix;
    this[__localScope__] = localScope;
    this[__name__] = name;
    this[__resolvedValues__] = new Map();
  }

  _createClass(Provider, {
    resolve: {

      /**
       * Resolves the provider. Resolved values are cached per scope.
       *
       * @method resolve
       * @param {DI.Scope} scope The scope to resolve the value in.
       * @return {Object} The resolved value for the given scope.
       */

      value: function resolve(scope) {
        var _this = this;

        if (!this[__resolvedValues__].has(scope)) {
          (function () {
            var argsString = _this[__function__].toString().match(FN_ARGS)[1];
            var args = argsString ? argsString.split(",") : [];

            var resolvedArgs = _this[__keys__].map(function (key, i) {

              // Check if the key is optional.
              var optional = key[key.length - 1] === "?";
              if (optional) {
                key = key.substring(0, key.length - 1);
              }

              // Check if the key is root key.
              var isRoot = key[0] === "/";
              if (isRoot) {
                key = key.substring(1);
              } else if (_this[__prefix__]) {
                key = "" + _this[__prefix__] + "." + key;
              }

              // Now replace any = in the key with the argument name.
              key = key.replace("=", args[i] ? args[i].trim() : "");

              // TODO(gs): Handle cyclic dependency.
              var value = undefined;

              try {
                // Check the local scope first.
                value = _this[__localScope__][__get__](key, scope);

                if (value === undefined) {
                  // If value cannot be resolved in the local scope, check the given scope.
                  value = scope[__get__](key, scope);
                }

                if (value === undefined) {
                  // If value cannot be resolved in the local scope, check the global bindings.
                  value = Globals.getGlobal(key, scope);
                }
              } catch (e) {
                // TODO(gs): Make a shared method.
                if (_this[__name__]) {
                  throw "" + e + "\n\twhile providing " + _this[__name__];
                } else {
                  throw "" + e + "\n\twhile running expression";
                }
              }

              if (value === undefined) {
                if (optional) {
                  return undefined;
                } else if (_this[__name__]) {
                  throw "Cannot find " + key + " while providing " + _this[__name__];
                } else {
                  throw "Cannot find " + key + " while running expression";
                }
              }

              return value;
            });

            var value = undefined;

            try {
              value = _this[__function__].apply(null, resolvedArgs);
            } catch (e) {
              if (_this[__name__]) {
                throw "Uncaught exception " + e + "\n\twhile running provider " + _this[__name__];
              } else {
                throw "Uncaught exception " + e + "\n\twhile running expression";
              }
            }

            if (value === undefined && _this[__name__]) {
              console.warn("Value of " + _this[__name__] + " is undefined");
            }

            _this[__resolvedValues__].set(scope, value);
          })();
        }

        return this[__resolvedValues__].get(scope);
      }
    }
  });

  return Provider;
})();

module.exports = Provider;

},{"./globals":2}],5:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createComputedClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var prop = props[i]; prop.configurable = true; if (prop.value) prop.writable = true; Object.defineProperty(target, prop.key, prop); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var BindingTree = _interopRequire(require("./bindingtree"));

var Provider = _interopRequire(require("./provider"));

var Globals = _interopRequire(require("./globals"));

// Private symbols.
var __localBindings__ = Symbol("localBindings");
var __parentScope__ = Symbol("parentScope");
var __prefix__ = Symbol("prefix");

var __createProvider__ = Symbol();

var __get__ = Globals.get;
var bindings = Globals.bindings;

var Scope = (function () {
  /**
   * Scope containing local bindings.
   *
   * @class DI.Scope
   * @constructor
   * @param {DI.Scope} [parentScope=null] The parent scope.
   */

  function Scope() {
    var parentScope = arguments[0] === undefined ? null : arguments[0];
    var prefix = arguments[1] === undefined ? "" : arguments[1];

    _classCallCheck(this, Scope);

    this[__localBindings__] = new BindingTree();
    this[__parentScope__] = parentScope;
    this[__prefix__] = prefix;
  }

  _createComputedClass(Scope, [{
    key: __createProvider__,
    value: function (value) {
      var name = arguments[1] === undefined ? null : arguments[1];

      var fn = value.splice(value.length - 1)[0];
      return new Provider(fn, value, this[__prefix__], this, name);
    }
  }, {
    key: __get__,
    value: function (key, scope) {
      var provider = this[__localBindings__].get(key);
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
  }, {
    key: "with",

    /**
     * Creates a new child scope with the given value bound to the given key in its local binding.
     *
     * @method with
     * @param {string} key The key to bound the value to.
     * @param {Function} fn The function to run. The function's arguments will be bound based on
     *    their names.
     * @return {DI.Scope} The newly created child scope.
     */
    value: function _with(key, value) {
      var childScope = new Scope(this, this[__prefix__]);
      childScope[__localBindings__].add(append(this[__prefix__], key), this[__createProvider__](value, key));
      return childScope;
    }
  }, {
    key: "constant",

    /**
     * Creates a new child scope with the given value bound to the given key in its local binding.
     * This is similar to {{#crossLink "DI.Scope/with"}}{{/crossLink}}, but the value is a constant.
     *
     * @method constant
     * @param {string} key The key to bound the value to.
     * @param {Object} value The object to bind to the given key.
     * @return {DI.Scope} The newly created child scope.
     */
    value: function constant(key, value) {
      return this["with"](key, [function () {
        return value;
      }]);
    }
  }, {
    key: "bind",

    /**
     * Globally binds the given value to the given key.
     *
     * @method bind
     * @param {string} key The key to bound the value to.
     * @param {Function} fn The function to run. The function's arguments will be bound based on
     *    their names.
     */
    value: function bind(key, value) {
      bindings.add(append(this[__prefix__], key), this[__createProvider__](value, key));
      return this;
    }
  }, {
    key: "get",

    /**
     * Returns the provider bound to the given key and resolve it in this scope. This will first check
     * for the local bindings, then its ancestors. If no binding is found in the ancestral path, this
     * will check for the global bindings.
     *
     * @method get
     * @param {string} key Key whose bound value should be returned.
     * @return {any} The value bound to the given key, or undefined if no values can be found.
     */
    value: function get(key) {
      var value = this[__get__](append(this[__prefix__], key));
      if (value === undefined) {
        return Globals.getGlobal(key, this);
      } else {
        return value;
      }
    }
  }, {
    key: "run",

    /**
     * Runs the given function after injecting any dependencies.
     *
     * @method run
     * @param {Function} fn The function to run. The function's arguments will be bound based on
     *    their names.
     */
    value: function run(fn) {
      this[__createProvider__](fn).resolve(this);
    }
  }, {
    key: "prefix",

    /**
     * Prefix any keys given to this scope with the given prefix.
     *
     * @method prefix
     * @param {string} prefix The prefix to add.
     * @return {DI.Scope} The newly created child scope with the given prefix.
     */
    value: (function (_prefix) {
      var _prefixWrapper = function prefix(_x) {
        return _prefix.apply(this, arguments);
      };

      _prefixWrapper.toString = function () {
        return _prefix.toString();
      };

      return _prefixWrapper;
    })(function (prefix) {
      return new Scope(this, append(prefix, this[__prefix__]));
    })
  }]);

  return Scope;
})();

function append(l, r) {
  return [l, r].filter(function (i) {
    return !!i;
  }).join(".");
}

module.exports = Scope;

},{"./bindingtree":1,"./globals":2,"./provider":4}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZ3NvZWQvcHJvai9kaS9zcmMvYmluZGluZ3RyZWUuanMiLCIvVXNlcnMvZ3NvZWQvcHJvai9kaS9zcmMvZ2xvYmFscy5qcyIsIi9Vc2Vycy9nc29lZC9wcm9qL2RpL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9nc29lZC9wcm9qL2RpL3NyYy9wcm92aWRlci5qcyIsIi9Vc2Vycy9nc29lZC9wcm9qL2RpL3NyYy9zY29wZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNDQSxJQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXBDLElBQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQzs7SUFFaEIsV0FBVzs7Ozs7Ozs7QUFPSixXQVBQLFdBQVcsR0FPRDswQkFQVixXQUFXOztBQVFiLFFBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0dBQzlCOztlQVRHLFdBQVc7QUFxQmYsT0FBRzs7Ozs7Ozs7Ozs7OzthQUFBLGFBQUMsR0FBRyxFQUFFLEtBQUssRUFBYTtZQUFYLEtBQUssZ0NBQUcsQ0FBQzs7O0FBRXZCLFlBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEMsWUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDOztBQUV2RCxZQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUNyQyxjQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRTtBQUMvQixlQUFHLEVBQUUsR0FBRztBQUNSLGlCQUFLLEVBQUUsS0FBSztXQUNiLENBQUMsQ0FBQztTQUNKLE1B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IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gUHJpdmF0ZSBzeW1ib2xzLlxuY29uc3QgX192YWx1ZXNfXyA9IFN5bWJvbCgndmFsdWVzJyk7XG5cbmNvbnN0IFNFUEFSQVRPUiA9ICdfJztcblxuY2xhc3MgQmluZGluZ1RyZWUge1xuXG4gIC8qKlxuICAgKiBSZXByZXNlbnRzIGEgdHJlZSBvZiBib3VuZCB2YWx1ZXMga2V5ZWQgYnkgYmluZGluZyBrZXkuXG4gICAqIEBjbGFzcyBESS5CaW5kaW5nVHJlZVxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXNbX192YWx1ZXNfX10gPSBuZXcgTWFwKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgZ2l2ZW4ga2V5IGFuZCB2YWx1ZSB0byB0aGUgdHJlZS4gVGhlIHRyZWUgd2lsbCB0cnkgdG8gYmluZCB1c2luZyB0aGUgbGFzdCBzZWdtZW50IG9mXG4gICAqIHRoZSBrZXkuIElmIHRoaXMgY2F1c2VzIGEgY29uZmxpY3QsIGl0IHdpbGwgY3JlYXRlIGEgc3VidHJlZS5cbiAgICpcbiAgICogQG1ldGhvZCBhZGRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIGJpbmQgdGhlIHZhbHVlIHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWUgVGhlIHZhbHVlIHRvIGJlIGJvdW5kLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW2RlcHRoPTBdIFRoZSBkZXB0aCBvZiB0aGUga2V5IHRvIHVzZSBhcyBiaW5kaW5nIGtleS4gVGhpcyBzaG91bGQgbm90IGJlXG4gICAqICAgIGNhbGxlZCBmcm9tIG91dHNpZGUgdGhlIGNsYXNzLlxuICAgKi9cbiAgYWRkKGtleSwgdmFsdWUsIGRlcHRoID0gMCkge1xuICAgIC8vIFRPRE8oZ3MpOiBSZW1vdmUgdGhlIHNlcGFyYXRvclxuICAgIGxldCBzZWdtZW50cyA9IGtleS5zcGxpdChTRVBBUkFUT1IpO1xuICAgIGxldCBiaW5kaW5nS2V5ID0gc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0gMSAtIGRlcHRoXTtcblxuICAgIGlmICghdGhpc1tfX3ZhbHVlc19fXS5oYXMoYmluZGluZ0tleSkpIHtcbiAgICAgIHRoaXNbX192YWx1ZXNfX10uc2V0KGJpbmRpbmdLZXksIHtcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoZXJlIGlzIGFscmVhZHkgYSB2YWx1ZSBjb3JyZXNwb25kaW5nIHRvIHRoaXMga2V5XG4gICAgICBsZXQgZXhpc3RpbmdWYWx1ZSA9IHRoaXNbX192YWx1ZXNfX10uZ2V0KGJpbmRpbmdLZXkpO1xuICAgICAgaWYgKGV4aXN0aW5nVmFsdWUua2V5ID09PSBrZXkpIHtcbiAgICAgICAgdGhyb3cgYEtleSAke2tleX0gaXMgYWxyZWFkeSBib3VuZGA7XG4gICAgICB9XG5cbiAgICAgIGxldCBuZXdUcmVlID0gbmV3IEJpbmRpbmdUcmVlKCk7XG4gICAgICB0aGlzW19fdmFsdWVzX19dLnNldChiaW5kaW5nS2V5LCBuZXdUcmVlKTtcbiAgICAgIG5ld1RyZWUuYWRkKGV4aXN0aW5nVmFsdWUua2V5LCBleGlzdGluZ1ZhbHVlLnZhbHVlLCBkZXB0aCArIDEpO1xuICAgICAgbmV3VHJlZS5hZGQoa2V5LCB2YWx1ZSwgZGVwdGggKyAxKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmFsdWUgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW4ga2V5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IEtleSBvZiB0aGUgdmFsdWUgdG8gcmV0dXJuLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW2RlcHRoPTBdIFRoZSBkZXB0aCBvZiB0aGUga2V5IHRvIHVzZSBhcyBiaW5kaW5nIGtleS4gVGhpcyBzaG91bGQgbm90IGJlXG4gICAqICAgIGNhbGxlZCBmcm9tIG91dHNpZGUgdGhlIGNsYXNzLlxuICAgKiBAcmV0dXJuIHthbnl9IFRoZSBib3VuZCB2YWx1ZSwgb3IgdW5kZWZpbmVkIGlmIHRoZSB2YWx1ZSBjYW5ub3QgYmUgZm91bmQsIG9yIGlmIHRoZSBrZXkgaGFzXG4gICAqICAgIGNvbGxpc2lvbiBidXQgY29sbGlzaW9uIGNhbm5vdCBiZSByZXNvbHZlZC5cbiAgICovXG4gIGdldChrZXksIGRlcHRoID0gMCkge1xuICAgIGxldCBzZWdtZW50cyA9IGtleS5zcGxpdChTRVBBUkFUT1IpO1xuICAgIGxldCBiaW5kaW5nS2V5ID0gc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0gMSAtIGRlcHRoXTtcblxuICAgIGlmIChiaW5kaW5nS2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzW19fdmFsdWVzX19dLmhhcyhiaW5kaW5nS2V5KSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBsZXQgdmFsdWUgPSB0aGlzW19fdmFsdWVzX19dLmdldChiaW5kaW5nS2V5KTtcbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBCaW5kaW5nVHJlZSkge1xuICAgICAgcmV0dXJuIHZhbHVlLmdldChrZXksIGRlcHRoICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWx1ZS52YWx1ZTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmluZGluZ1RyZWU7IiwiaW1wb3J0IEJpbmRpbmdUcmVlIGZyb20gJy4vYmluZGluZ3RyZWUnO1xuXG5jb25zdCBHbG9iYWxzID0ge1xuICBnZXQ6IFN5bWJvbCgnZ2V0JyksXG5cbiAgZ2V0R2xvYmFsKGtleSwgc2NvcGUpIHtcbiAgICBsZXQgZ2xvYmFsUHJvdmlkZXIgPSB0aGlzLmJpbmRpbmdzLmdldChrZXkpO1xuICAgIGlmIChnbG9iYWxQcm92aWRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZ2xvYmFsUHJvdmlkZXIucmVzb2x2ZShzY29wZSk7XG4gICAgfVxuICB9LFxuXG4gIGJpbmRpbmdzOiBuZXcgQmluZGluZ1RyZWUoKVxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2xvYmFsczsiLCJpbXBvcnQgQmluZGluZ1RyZWUgZnJvbSAnLi9iaW5kaW5ndHJlZSc7XG5pbXBvcnQgR2xvYmFscyBmcm9tICcuL2dsb2JhbHMnO1xuaW1wb3J0IFByb3ZpZGVyIGZyb20gJy4vcHJvdmlkZXInO1xuaW1wb3J0IFNjb3BlIGZyb20gJy4vc2NvcGUnO1xuXG4oKHdpbmRvdykgPT4ge1xuICB3aW5kb3dbJ0RJJ10gPSBuZXcgU2NvcGUoKTtcblxuICB3aW5kb3dbJ0RJJ11bJ0JpbmRpbmdUcmVlJ10gPSBCaW5kaW5nVHJlZTtcbiAgd2luZG93WydESSddWydQcm92aWRlciddID0gUHJvdmlkZXI7XG4gIHdpbmRvd1snREknXVsnU2NvcGUnXSA9IFNjb3BlO1xuICB3aW5kb3dbJ0RJJ11bJ2JpbmRpbmdzJ10gPSBHbG9iYWxzLmJpbmRpbmdzO1xufSkod2luZG93KTsiLCJpbXBvcnQgR2xvYmFscyBmcm9tICcuL2dsb2JhbHMnO1xuXG5jb25zdCBfX2dldF9fID0gR2xvYmFscy5nZXQ7XG5cbi8vIFByaXZhdGUgc3ltYm9scy5cbmNvbnN0IF9fZnVuY3Rpb25fXyA9IFN5bWJvbCgpO1xuY29uc3QgX19sb2NhbFNjb3BlX18gPSBTeW1ib2woJ2xvY2FsU2NvcGUnKTtcbmNvbnN0IF9fbmFtZV9fID0gU3ltYm9sKCk7XG5jb25zdCBfX3ByZWZpeF9fID0gU3ltYm9sKCdwcmVmaXgnKTtcbmNvbnN0IF9fa2V5c19fID0gU3ltYm9sKCk7XG5jb25zdCBfX3Jlc29sdmVkVmFsdWVzX18gPSBTeW1ib2woKTtcblxuY29uc3QgRk5fQVJHUyA9IC9eZnVuY3Rpb25cXHMqW15cXChdKlxcKFxccyooW15cXCldKilcXCkvbTtcblxuY2xhc3MgUHJvdmlkZXIge1xuXG4gIC8qKlxuICAgKiBAY2xhc3MgREkuUHJvdmlkZXJcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB3aG9zZSBhcmd1bWVudHMgc2hvdWxkIGJlIHJlc29sdmVkLiBUaGUgbmFtZXMgd2lsbCBiZSB1c2VkIGFzXG4gICAqICAgIHRoZSBrZXkuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGtleXMgQXJyYXkgb2Yga2V5cyBmb3IgdGhlIGdpdmVuIGZ1bmN0aW9uJ3MgYXJndW1lbnQncyBuYW1lcy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHByZWZpeCBUaGUgcHJlZml4IHRvIHVzZSBmb3IgdGhlIGtleXMuXG4gICAqIEBwYXJhbSB7REkuU2NvcGV9IGxvY2FsU2NvcGUgVGhlIGxvY2FsIHNjb3BlLiBUaGlzIHdpbGwgYmUgcHJpb3JpdGl6ZWQgd2hlbiBjaGVja2luZyBmb3IgYm91bmRcbiAgICogICAgdmFsdWVzLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW25hbWU9bnVsbF0gUmVmZXJlbmNlIG5hbWUgb2YgdGhlIHByb3ZpZGVyLiBUaGlzIGlzIHVzZWQgZm9yIGRldGVjdGluZyBjeWNsaWNcbiAgICogICAgZGVwZW5kZW5jaWVzLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZm4sIGtleXMsIHByZWZpeCwgbG9jYWxTY29wZSwgbmFtZSA9IG51bGwpIHtcbiAgICB0aGlzW19fZnVuY3Rpb25fX10gPSBmbjtcbiAgICB0aGlzW19fa2V5c19fXSA9IGtleXM7XG4gICAgdGhpc1tfX3ByZWZpeF9fXSA9IHByZWZpeDtcbiAgICB0aGlzW19fbG9jYWxTY29wZV9fXSA9IGxvY2FsU2NvcGU7XG4gICAgdGhpc1tfX25hbWVfX10gPSBuYW1lO1xuICAgIHRoaXNbX19yZXNvbHZlZFZhbHVlc19fXSA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvbHZlcyB0aGUgcHJvdmlkZXIuIFJlc29sdmVkIHZhbHVlcyBhcmUgY2FjaGVkIHBlciBzY29wZS5cbiAgICpcbiAgICogQG1ldGhvZCByZXNvbHZlXG4gICAqIEBwYXJhbSB7REkuU2NvcGV9IHNjb3BlIFRoZSBzY29wZSB0byByZXNvbHZlIHRoZSB2YWx1ZSBpbi5cbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzb2x2ZWQgdmFsdWUgZm9yIHRoZSBnaXZlbiBzY29wZS5cbiAgICovXG4gIHJlc29sdmUoc2NvcGUpIHtcbiAgICBpZiAoIXRoaXNbX19yZXNvbHZlZFZhbHVlc19fXS5oYXMoc2NvcGUpKSB7XG4gICAgICBsZXQgYXJnc1N0cmluZyA9IHRoaXNbX19mdW5jdGlvbl9fXS50b1N0cmluZygpLm1hdGNoKEZOX0FSR1MpWzFdO1xuICAgICAgbGV0IGFyZ3MgPSBhcmdzU3RyaW5nID8gYXJnc1N0cmluZy5zcGxpdCgnLCcpIDogW107XG5cbiAgICAgIGxldCByZXNvbHZlZEFyZ3MgPSB0aGlzW19fa2V5c19fXS5tYXAoKGtleSwgaSkgPT4ge1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBrZXkgaXMgb3B0aW9uYWwuXG4gICAgICAgIGxldCBvcHRpb25hbCA9IGtleVtrZXkubGVuZ3RoIC0gMV0gPT09ICc/JztcbiAgICAgICAgaWYgKG9wdGlvbmFsKSB7XG4gICAgICAgICAga2V5ID0ga2V5LnN1YnN0cmluZygwLCBrZXkubGVuZ3RoIC0gMSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUga2V5IGlzIHJvb3Qga2V5LlxuICAgICAgICBsZXQgaXNSb290ID0ga2V5WzBdID09PSAnLyc7XG4gICAgICAgIGlmIChpc1Jvb3QpIHtcbiAgICAgICAgICBrZXkgPSBrZXkuc3Vic3RyaW5nKDEpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXNbX19wcmVmaXhfX10pIHtcbiAgICAgICAgICBrZXkgPSBgJHt0aGlzW19fcHJlZml4X19dfS4ke2tleX1gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm93IHJlcGxhY2UgYW55ID0gaW4gdGhlIGtleSB3aXRoIHRoZSBhcmd1bWVudCBuYW1lLlxuICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgnPScsIGFyZ3NbaV0gPyBhcmdzW2ldLnRyaW0oKSA6ICcnKTtcblxuICAgICAgICAvLyBUT0RPKGdzKTogSGFuZGxlIGN5Y2xpYyBkZXBlbmRlbmN5LlxuICAgICAgICBsZXQgdmFsdWU7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBDaGVjayB0aGUgbG9jYWwgc2NvcGUgZmlyc3QuXG4gICAgICAgICAgdmFsdWUgPSB0aGlzW19fbG9jYWxTY29wZV9fXVtfX2dldF9fXShrZXksIHNjb3BlKTtcblxuICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBJZiB2YWx1ZSBjYW5ub3QgYmUgcmVzb2x2ZWQgaW4gdGhlIGxvY2FsIHNjb3BlLCBjaGVjayB0aGUgZ2l2ZW4gc2NvcGUuXG4gICAgICAgICAgICB2YWx1ZSA9IHNjb3BlW19fZ2V0X19dKGtleSwgc2NvcGUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBJZiB2YWx1ZSBjYW5ub3QgYmUgcmVzb2x2ZWQgaW4gdGhlIGxvY2FsIHNjb3BlLCBjaGVjayB0aGUgZ2xvYmFsIGJpbmRpbmdzLlxuICAgICAgICAgICAgdmFsdWUgPSBHbG9iYWxzLmdldEdsb2JhbChrZXksIHNjb3BlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBUT0RPKGdzKTogTWFrZSBhIHNoYXJlZCBtZXRob2QuXG4gICAgICAgICAgaWYgKHRoaXNbX19uYW1lX19dKSB7XG4gICAgICAgICAgICB0aHJvdyBgJHtlfVxcblxcdHdoaWxlIHByb3ZpZGluZyAke3RoaXNbX19uYW1lX19dfWA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGAke2V9XFxuXFx0d2hpbGUgcnVubmluZyBleHByZXNzaW9uYDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChvcHRpb25hbCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXNbX19uYW1lX19dKSB7XG4gICAgICAgICAgICB0aHJvdyBgQ2Fubm90IGZpbmQgJHtrZXl9IHdoaWxlIHByb3ZpZGluZyAke3RoaXNbX19uYW1lX19dfWA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGBDYW5ub3QgZmluZCAke2tleX0gd2hpbGUgcnVubmluZyBleHByZXNzaW9uYDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9KTtcblxuICAgICAgbGV0IHZhbHVlO1xuXG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IHRoaXNbX19mdW5jdGlvbl9fXS5hcHBseShudWxsLCByZXNvbHZlZEFyZ3MpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAodGhpc1tfX25hbWVfX10pIHtcbiAgICAgICAgICB0aHJvdyBgVW5jYXVnaHQgZXhjZXB0aW9uICR7ZX1cXG5cXHR3aGlsZSBydW5uaW5nIHByb3ZpZGVyICR7dGhpc1tfX25hbWVfX119YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBgVW5jYXVnaHQgZXhjZXB0aW9uICR7ZX1cXG5cXHR3aGlsZSBydW5uaW5nIGV4cHJlc3Npb25gO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmIHRoaXNbX19uYW1lX19dKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgVmFsdWUgb2YgJHt0aGlzW19fbmFtZV9fXX0gaXMgdW5kZWZpbmVkYCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXNbX19yZXNvbHZlZFZhbHVlc19fXS5zZXQoc2NvcGUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1tfX3Jlc29sdmVkVmFsdWVzX19dLmdldChzY29wZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvdmlkZXI7IiwiaW1wb3J0IEJpbmRpbmdUcmVlIGZyb20gJy4vYmluZGluZ3RyZWUnO1xuaW1wb3J0IFByb3ZpZGVyIGZyb20gJy4vcHJvdmlkZXInO1xuaW1wb3J0IEdsb2JhbHMgZnJvbSAnLi9nbG9iYWxzJztcblxuXG4vLyBQcml2YXRlIHN5bWJvbHMuXG5jb25zdCBfX2xvY2FsQmluZGluZ3NfXyA9IFN5bWJvbCgnbG9jYWxCaW5kaW5ncycpO1xuY29uc3QgX19wYXJlbnRTY29wZV9fID0gU3ltYm9sKCdwYXJlbnRTY29wZScpO1xuY29uc3QgX19wcmVmaXhfXyA9IFN5bWJvbCgncHJlZml4Jyk7XG5cbmNvbnN0IF9fY3JlYXRlUHJvdmlkZXJfXyA9IFN5bWJvbCgpO1xuXG5jb25zdCBfX2dldF9fID0gR2xvYmFscy5nZXQ7XG5jb25zdCBiaW5kaW5ncyA9IEdsb2JhbHMuYmluZGluZ3M7XG5cbmNsYXNzIFNjb3BlIHtcbiAgLyoqXG4gICAqIFNjb3BlIGNvbnRhaW5pbmcgbG9jYWwgYmluZGluZ3MuXG4gICAqXG4gICAqIEBjbGFzcyBESS5TY29wZVxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtESS5TY29wZX0gW3BhcmVudFNjb3BlPW51bGxdIFRoZSBwYXJlbnQgc2NvcGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJlbnRTY29wZSA9IG51bGwsIHByZWZpeCA9ICcnKSB7XG4gICAgdGhpc1tfX2xvY2FsQmluZGluZ3NfX10gPSBuZXcgQmluZGluZ1RyZWUoKTtcbiAgICB0aGlzW19fcGFyZW50U2NvcGVfX10gPSBwYXJlbnRTY29wZTtcbiAgICB0aGlzW19fcHJlZml4X19dID0gcHJlZml4O1xuICB9XG5cbiAgW19fY3JlYXRlUHJvdmlkZXJfX10odmFsdWUsIG5hbWUgPSBudWxsKSB7XG4gICAgbGV0IGZuID0gdmFsdWUuc3BsaWNlKHZhbHVlLmxlbmd0aCAtIDEpWzBdO1xuICAgIHJldHVybiBuZXcgUHJvdmlkZXIoZm4sIHZhbHVlLCB0aGlzW19fcHJlZml4X19dLCB0aGlzLCBuYW1lKTtcbiAgfVxuXG4gIFtfX2dldF9fXShrZXksIHNjb3BlKSB7XG4gICAgbGV0IHByb3ZpZGVyID0gdGhpc1tfX2xvY2FsQmluZGluZ3NfX10uZ2V0KGtleSk7XG4gICAgaWYgKHByb3ZpZGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0aGlzW19fcGFyZW50U2NvcGVfX10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbX19wYXJlbnRTY29wZV9fXVtfX2dldF9fXShrZXksIHNjb3BlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwcm92aWRlci5yZXNvbHZlKHNjb3BlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBjaGlsZCBzY29wZSB3aXRoIHRoZSBnaXZlbiB2YWx1ZSBib3VuZCB0byB0aGUgZ2l2ZW4ga2V5IGluIGl0cyBsb2NhbCBiaW5kaW5nLlxuICAgKlxuICAgKiBAbWV0aG9kIHdpdGhcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIGJvdW5kIHRoZSB2YWx1ZSB0by5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIHJ1bi4gVGhlIGZ1bmN0aW9uJ3MgYXJndW1lbnRzIHdpbGwgYmUgYm91bmQgYmFzZWQgb25cbiAgICogICAgdGhlaXIgbmFtZXMuXG4gICAqIEByZXR1cm4ge0RJLlNjb3BlfSBUaGUgbmV3bHkgY3JlYXRlZCBjaGlsZCBzY29wZS5cbiAgICovXG4gIHdpdGgoa2V5LCB2YWx1ZSkge1xuICAgIGxldCBjaGlsZFNjb3BlID0gbmV3IFNjb3BlKHRoaXMsIHRoaXNbX19wcmVmaXhfX10pO1xuICAgIGNoaWxkU2NvcGVbX19sb2NhbEJpbmRpbmdzX19dXG4gICAgICAgIC5hZGQoYXBwZW5kKHRoaXNbX19wcmVmaXhfX10sIGtleSksIHRoaXNbX19jcmVhdGVQcm92aWRlcl9fXSh2YWx1ZSwga2V5KSk7XG4gICAgcmV0dXJuIGNoaWxkU2NvcGU7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBjaGlsZCBzY29wZSB3aXRoIHRoZSBnaXZlbiB2YWx1ZSBib3VuZCB0byB0aGUgZ2l2ZW4ga2V5IGluIGl0cyBsb2NhbCBiaW5kaW5nLlxuICAgKiBUaGlzIGlzIHNpbWlsYXIgdG8ge3sjY3Jvc3NMaW5rIFwiREkuU2NvcGUvd2l0aFwifX17ey9jcm9zc0xpbmt9fSwgYnV0IHRoZSB2YWx1ZSBpcyBhIGNvbnN0YW50LlxuICAgKlxuICAgKiBAbWV0aG9kIGNvbnN0YW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byBib3VuZCB0aGUgdmFsdWUgdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSBUaGUgb2JqZWN0IHRvIGJpbmQgdG8gdGhlIGdpdmVuIGtleS5cbiAgICogQHJldHVybiB7REkuU2NvcGV9IFRoZSBuZXdseSBjcmVhdGVkIGNoaWxkIHNjb3BlLlxuICAgKi9cbiAgY29uc3RhbnQoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLndpdGgoa2V5LCBbKCkgPT4gdmFsdWVdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHbG9iYWxseSBiaW5kcyB0aGUgZ2l2ZW4gdmFsdWUgdG8gdGhlIGdpdmVuIGtleS5cbiAgICpcbiAgICogQG1ldGhvZCBiaW5kXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byBib3VuZCB0aGUgdmFsdWUgdG8uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBydW4uIFRoZSBmdW5jdGlvbidzIGFyZ3VtZW50cyB3aWxsIGJlIGJvdW5kIGJhc2VkIG9uXG4gICAqICAgIHRoZWlyIG5hbWVzLlxuICAgKi9cbiAgYmluZChrZXksIHZhbHVlKSB7XG4gICAgYmluZGluZ3MuYWRkKGFwcGVuZCh0aGlzW19fcHJlZml4X19dLCBrZXkpLCB0aGlzW19fY3JlYXRlUHJvdmlkZXJfX10odmFsdWUsIGtleSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHByb3ZpZGVyIGJvdW5kIHRvIHRoZSBnaXZlbiBrZXkgYW5kIHJlc29sdmUgaXQgaW4gdGhpcyBzY29wZS4gVGhpcyB3aWxsIGZpcnN0IGNoZWNrXG4gICAqIGZvciB0aGUgbG9jYWwgYmluZGluZ3MsIHRoZW4gaXRzIGFuY2VzdG9ycy4gSWYgbm8gYmluZGluZyBpcyBmb3VuZCBpbiB0aGUgYW5jZXN0cmFsIHBhdGgsIHRoaXNcbiAgICogd2lsbCBjaGVjayBmb3IgdGhlIGdsb2JhbCBiaW5kaW5ncy5cbiAgICpcbiAgICogQG1ldGhvZCBnZXRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBLZXkgd2hvc2UgYm91bmQgdmFsdWUgc2hvdWxkIGJlIHJldHVybmVkLlxuICAgKiBAcmV0dXJuIHthbnl9IFRoZSB2YWx1ZSBib3VuZCB0byB0aGUgZ2l2ZW4ga2V5LCBvciB1bmRlZmluZWQgaWYgbm8gdmFsdWVzIGNhbiBiZSBmb3VuZC5cbiAgICovXG4gIGdldChrZXkpIHtcbiAgICBsZXQgdmFsdWUgPSB0aGlzW19fZ2V0X19dKGFwcGVuZCh0aGlzW19fcHJlZml4X19dLCBrZXkpKTtcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIEdsb2JhbHMuZ2V0R2xvYmFsKGtleSwgdGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUnVucyB0aGUgZ2l2ZW4gZnVuY3Rpb24gYWZ0ZXIgaW5qZWN0aW5nIGFueSBkZXBlbmRlbmNpZXMuXG4gICAqXG4gICAqIEBtZXRob2QgcnVuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBydW4uIFRoZSBmdW5jdGlvbidzIGFyZ3VtZW50cyB3aWxsIGJlIGJvdW5kIGJhc2VkIG9uXG4gICAqICAgIHRoZWlyIG5hbWVzLlxuICAgKi9cbiAgcnVuKGZuKSB7XG4gICAgdGhpc1tfX2NyZWF0ZVByb3ZpZGVyX19dKGZuKS5yZXNvbHZlKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZWZpeCBhbnkga2V5cyBnaXZlbiB0byB0aGlzIHNjb3BlIHdpdGggdGhlIGdpdmVuIHByZWZpeC5cbiAgICpcbiAgICogQG1ldGhvZCBwcmVmaXhcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByZWZpeCBUaGUgcHJlZml4IHRvIGFkZC5cbiAgICogQHJldHVybiB7REkuU2NvcGV9IFRoZSBuZXdseSBjcmVhdGVkIGNoaWxkIHNjb3BlIHdpdGggdGhlIGdpdmVuIHByZWZpeC5cbiAgICovXG4gIHByZWZpeChwcmVmaXgpIHtcbiAgICByZXR1cm4gbmV3IFNjb3BlKHRoaXMsIGFwcGVuZChwcmVmaXgsIHRoaXNbX19wcmVmaXhfX10pKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhcHBlbmQobCwgcikge1xuICByZXR1cm4gW2wsIHJdLmZpbHRlcihpID0+ICEhaSkuam9pbignLicpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBTY29wZTsiXX0=
