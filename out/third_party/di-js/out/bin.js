(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var __binding__ = Symbol();
var __cachedValue__ = Symbol();
var __key__ = Symbol();
var __provider__ = Symbol();
var __scope__ = Symbol("scope");

var Binding = (function () {
  function Binding(key, fn, scope) {
    _classCallCheck(this, Binding);

    this[__key__] = key;
    this[__provider__] = fn;
    this[__scope__] = scope;
    this.fn = fn;
  }

  _createClass(Binding, {
    resolve: {
      value: function resolve(runContext) {
        var _this = this;

        var searchChain = arguments[1] === undefined ? [] : arguments[1];

        if (!runContext.has(this[__scope__], this[__key__])) {
          (function () {
            var optional = function (key) {
              // Check if the key is already in the search chain.
              if (searchChain.indexOf(key) >= 0) {
                throw new Error("Cyclic dependency:\n" + searchChain.join(" -> ") + " -> " + key);
              }

              var binding = _this[__scope__].findBinding(key);
              if (binding === undefined) {
                return undefined;
              } else {
                return binding.resolve(runContext, searchChain.concat([key]));
              }
            };

            var require = function (key) {
              var value = optional(key);
              if (value === undefined) {
                throw new Error("Cannot find " + key + ":\n" + searchChain.join(" -> ") + " -> " + key);
              }
              return value;
            };

            runContext.add(_this[__scope__], _this[__key__], _this[__provider__](require, optional));
          })();
        }

        return runContext.get(this[__scope__], this[__key__]);
      }
    },
    provider: {
      get: function () {
        return this[__provider__];
      }
    }
  });

  return Binding;
})();

module.exports = Binding;

},{}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Binding = _interopRequire(require("./binding"));

var RunContext = _interopRequire(require("./runcontext"));

var Scope = _interopRequire(require("./scope"));

(function (window) {
  window.DIJS = new Scope();
  window.DIJS.Scope = Scope;
  window.DIJS.Binding = Binding;
  window.DIJS.RunContext = RunContext;
})(window);

},{"./binding":1,"./runcontext":3,"./scope":4}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var __data__ = Symbol();

var RunContext = (function () {
  function RunContext() {
    _classCallCheck(this, RunContext);

    this[__data__] = new Map();
  }

  _createClass(RunContext, {
    add: {
      value: function add(scope, key, value) {
        if (!this[__data__].has(scope)) {
          this[__data__].set(scope, new Map());
        }

        this[__data__].get(scope).set(key, value);
      }
    },
    get: {
      value: function get(scope, key) {
        if (this.has(scope, key)) {
          return this[__data__].get(scope).get(key);
        } else {
          return undefined;
        }
      }
    },
    has: {
      value: function has(scope, key) {
        return this[__data__].has(scope) && this[__data__].get(scope).has(key);
      }
    }
  });

  return RunContext;
})();

module.exports = RunContext;

},{}],4:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _createComputedClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var prop = props[i]; prop.configurable = true; if (prop.value) prop.writable = true; Object.defineProperty(target, prop.key, prop); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Binding = _interopRequire(require("./binding"));

var RunContext = _interopRequire(require("./runcontext"));

// Private symbols.
var __localBindings__ = Symbol("localBindings");
var __parentScope__ = Symbol("parentScope");
var __prefix__ = Symbol("prefix");
var __rootScope__ = Symbol("rootScope");

var __addBinding__ = Symbol("registerProvider");
var __findProvider__ = Symbol("findProvider");

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
    var rootScope = arguments[1] === undefined ? this : arguments[1];

    _classCallCheck(this, Scope);

    this[__localBindings__] = new Map();
    this[__parentScope__] = parentScope;
    this[__rootScope__] = rootScope;
  }

  _createComputedClass(Scope, [{
    key: __addBinding__,
    value: function (key, binding) {
      if (this[__localBindings__].has(key)) {
        throw new Error("" + key + " is already bound");
      }
      this[__localBindings__].set(key, binding);
    }
  }, {
    key: "findBinding",
    value: function findBinding(key) {
      // Checks the local binding.
      var binding = this[__localBindings__].get(key);
      if (binding === undefined) {
        if (this[__parentScope__]) {
          return this[__parentScope__].findBinding(key);
        } else {
          return undefined;
        }
      } else {
        return binding;
      }
    }
  }, {
    key: "with",

    /**
     * Creates a new child scope with the given value bound to the given key in its local binding.
     *
     * TODO(gs)
     *
     * @method with
     * @param {string} key The key to bound the value to.
     * @param {Object} keys Object with mapping of variable name to the bound name.
     * @param {Function} fn The provider function to run.
     * @return {DI.Scope} The newly created child scope.
     */
    value: function _with(key, fn) {
      var childScope = new Scope(this, this[__rootScope__]);
      var binding = new Binding(key, fn, childScope);
      childScope[__addBinding__](key, binding);
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
      return this["with"](key, function () {
        return value;
      });
    }
  }, {
    key: "bind",

    /**
     * Binds the given value to the given key. The execution scope of the provider function is still
     * this scope.
     *
     * TODO(gs)
     *
     * @method bind
     * @param {string} key The key to bound the value to.
     * @param {Object} keys Object with mapping of variable name to the bound name.
     * @param {Function} fn The provider function to run.
     */
    value: function bind(key, fn) {
      var binding = new Binding(key, fn, this);
      this[__rootScope__][__addBinding__](key, binding);
      return this;
    }
  }, {
    key: "run",

    /**
     * Runs the given function after injecting any dependencies.
     *
     * TODO(gs)
     *
     * @method run
     * @param {Function} fn The function to run.
     */
    value: function run(fn) {
      var runBinding = new Binding(null, fn, this);

      // Resolves all the bindings in the current scope.
      var resolvedValues = new RunContext();

      var resolveBindings = (function (_resolveBindings) {
        var _resolveBindingsWrapper = function resolveBindings(_x) {
          return _resolveBindings.apply(this, arguments);
        };

        _resolveBindingsWrapper.toString = function () {
          return _resolveBindings.toString();
        };

        return _resolveBindingsWrapper;
      })(function (scope) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = scope[__localBindings__][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2);

            var key = _step$value[0];
            var binding = _step$value[1];

            binding.resolve(resolvedValues);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (scope[__parentScope__]) {
          resolveBindings(scope[__parentScope__]);
        }
      });

      resolveBindings(this);
      return runBinding.resolve(resolvedValues);
    }
  }, {
    key: "reset",
    value: function reset() {
      this[__localBindings__].clear();
    }
  }]);

  return Scope;
})();

module.exports = Scope;

},{"./binding":1,"./runcontext":3}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZ3NvZWQvcHJvai9kaS1qcy9zcmMvYmluZGluZy5qcyIsIi9Vc2Vycy9nc29lZC9wcm9qL2RpLWpzL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9nc29lZC9wcm9qL2RpLWpzL3NyYy9ydW5jb250ZXh0LmpzIiwiL1VzZXJzL2dzb2VkL3Byb2ovZGktanMvc3JjL3Njb3BlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUEsSUFBTSxXQUFXLEdBQUcsTUFBTSxFQUFFLENBQUM7QUFDN0IsSUFBTSxlQUFlLEdBQUcsTUFBTSxFQUFFLENBQUM7QUFDakMsSUFBTSxPQUFPLEdBQUcsTUFBTSxFQUFFLENBQUM7QUFDekIsSUFBTSxZQUFZLEdBQUcsTUFBTSxFQUFFLENBQUM7QUFDOUIsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztJQUU1QixPQUFPO0FBQ0EsV0FEUCxPQUFPLENBQ0MsR0FBRyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUU7MEJBRHhCLE9BQU87O0FBRVQsUUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNwQixRQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDeEIsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7R0FDZDs7ZUFORyxPQUFPO0FBUVgsV0FBTzthQUFBLGlCQUFDLFVBQVUsRUFBb0I7OztZQUFsQixXQUFXLGdDQUFHLEVBQUU7O0FBQ2xDLFlBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRTs7QUFDbkQsZ0JBQUksUUFBUSxHQUFHLFVBQUEs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Q0FBQztLQUNwQzs7Ozs7Ozs7Ozs7Ozs7O1dBYUcsY0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFO0FBQ1osVUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN6QyxVQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2xELGFBQU8sSUFBSSxDQUFDO0tBQ2I7Ozs7Ozs7Ozs7OztXQVVFLGFBQUMsRUFBRSxFQUFFO0FBQ04sVUFBSSxVQUFVLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQzs7O0FBRzdDLFVBQUksY0FBYyxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7O0FBRXRDLFVBQUksZUFBZTs7Ozs7Ozs7OztTQUFHLFVBQVMsS0FBSyxFQUFFOzs7Ozs7QUFDcEMsK0JBQTJCLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQzs7O2dCQUF6QyxHQUFHO2dCQUFFLE9BQU87O0FBQ3BCLG1CQUFPLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1dBQ2pDOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsWUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQUU7QUFDMUIseUJBQWUsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztTQUN6QztPQUNGLENBQUEsQ0FBQzs7QUFFRixxQkFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RCLGFBQU8sVUFBVSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUMzQzs7O1dBRUksaUJBQUc7QUFDTixVQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNqQzs7O1NBakhHLEtBQUs7OztpQkFvSEksS0FBSyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBfX2JpbmRpbmdfXyA9IFN5bWJvbCgpO1xuY29uc3QgX19jYWNoZWRWYWx1ZV9fID0gU3ltYm9sKCk7XG5jb25zdCBfX2tleV9fID0gU3ltYm9sKCk7XG5jb25zdCBfX3Byb3ZpZGVyX18gPSBTeW1ib2woKTtcbmNvbnN0IF9fc2NvcGVfXyA9IFN5bWJvbCgnc2NvcGUnKTtcblxuY2xhc3MgQmluZGluZyB7XG4gIGNvbnN0cnVjdG9yKGtleSwgZm4sIHNjb3BlKSB7XG4gICAgdGhpc1tfX2tleV9fXSA9IGtleTtcbiAgICB0aGlzW19fcHJvdmlkZXJfX10gPSBmbjtcbiAgICB0aGlzW19fc2NvcGVfX10gPSBzY29wZTtcbiAgICB0aGlzLmZuID0gZm47XG4gIH1cblxuICByZXNvbHZlKHJ1bkNvbnRleHQsIHNlYXJjaENoYWluID0gW10pIHtcbiAgICBpZiAoIXJ1bkNvbnRleHQuaGFzKHRoaXNbX19zY29wZV9fXSwgdGhpc1tfX2tleV9fXSkpIHtcbiAgICAgIGxldCBvcHRpb25hbCA9IGtleSA9PiB7XG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBrZXkgaXMgYWxyZWFkeSBpbiB0aGUgc2VhcmNoIGNoYWluLlxuICAgICAgICBpZiAoc2VhcmNoQ2hhaW4uaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEN5Y2xpYyBkZXBlbmRlbmN5OlxcbiR7c2VhcmNoQ2hhaW4uam9pbignIC0+ICcpfSAtPiAke2tleX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBiaW5kaW5nID0gdGhpc1tfX3Njb3BlX19dLmZpbmRCaW5kaW5nKGtleSk7XG4gICAgICAgIGlmIChiaW5kaW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBiaW5kaW5nLnJlc29sdmUocnVuQ29udGV4dCwgc2VhcmNoQ2hhaW4uY29uY2F0KFtrZXldKSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGxldCByZXF1aXJlID0ga2V5ID0+IHtcbiAgICAgICAgbGV0IHZhbHVlID0gb3B0aW9uYWwoa2V5KTtcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBmaW5kICR7a2V5fTpcXG4ke3NlYXJjaENoYWluLmpvaW4oJyAtPiAnKX0gLT4gJHtrZXl9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfTtcblxuICAgICAgcnVuQ29udGV4dC5hZGQodGhpc1tfX3Njb3BlX19dLCB0aGlzW19fa2V5X19dLCB0aGlzW19fcHJvdmlkZXJfX10ocmVxdWlyZSwgb3B0aW9uYWwpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcnVuQ29udGV4dC5nZXQodGhpc1tfX3Njb3BlX19dLCB0aGlzW19fa2V5X19dKTtcbiAgfVxuXG4gIGdldCBwcm92aWRlcigpIHtcbiAgICByZXR1cm4gdGhpc1tfX3Byb3ZpZGVyX19dO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJpbmRpbmc7XG4iLCJpbXBvcnQgQmluZGluZyBmcm9tICcuL2JpbmRpbmcnO1xuaW1wb3J0IFJ1bkNvbnRleHQgZnJvbSAnLi9ydW5jb250ZXh0JztcbmltcG9ydCBTY29wZSBmcm9tICcuL3Njb3BlJztcblxuKCh3aW5kb3cpID0+IHtcbiAgd2luZG93WydESUpTJ10gPSBuZXcgU2NvcGUoKTtcbiAgd2luZG93WydESUpTJ11bJ1Njb3BlJ10gPSBTY29wZTtcbiAgd2luZG93WydESUpTJ11bJ0JpbmRpbmcnXSA9IEJpbmRpbmc7XG4gIHdpbmRvd1snRElKUyddWydSdW5Db250ZXh0J10gPSBSdW5Db250ZXh0O1xufSkod2luZG93KTtcbiIsImNvbnN0IF9fZGF0YV9fID0gU3ltYm9sKCk7XG5cbmNsYXNzIFJ1bkNvbnRleHQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzW19fZGF0YV9fXSA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIGFkZChzY29wZSwga2V5LCB2YWx1ZSkge1xuICAgIGlmICghdGhpc1tfX2RhdGFfX10uaGFzKHNjb3BlKSkge1xuICAgICAgdGhpc1tfX2RhdGFfX10uc2V0KHNjb3BlLCBuZXcgTWFwKCkpO1xuICAgIH1cblxuICAgIHRoaXNbX19kYXRhX19dLmdldChzY29wZSkuc2V0KGtleSwgdmFsdWUpO1xuICB9XG5cbiAgZ2V0KHNjb3BlLCBrZXkpIHtcbiAgICBpZiAodGhpcy5oYXMoc2NvcGUsIGtleSkpIHtcbiAgICAgIHJldHVybiB0aGlzW19fZGF0YV9fXS5nZXQoc2NvcGUpLmdldChrZXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGhhcyhzY29wZSwga2V5KSB7XG4gICAgcmV0dXJuIHRoaXNbX19kYXRhX19dLmhhcyhzY29wZSkgJiYgdGhpc1tfX2RhdGFfX10uZ2V0KHNjb3BlKS5oYXMoa2V5KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSdW5Db250ZXh0O1xuIiwiaW1wb3J0IEJpbmRpbmcgZnJvbSAnLi9iaW5kaW5nJztcbmltcG9ydCBSdW5Db250ZXh0IGZyb20gJy4vcnVuY29udGV4dCc7XG5cbi8vIFByaXZhdGUgc3ltYm9scy5cbmNvbnN0IF9fbG9jYWxCaW5kaW5nc19fID0gU3ltYm9sKCdsb2NhbEJpbmRpbmdzJyk7XG5jb25zdCBfX3BhcmVudFNjb3BlX18gPSBTeW1ib2woJ3BhcmVudFNjb3BlJyk7XG5jb25zdCBfX3ByZWZpeF9fID0gU3ltYm9sKCdwcmVmaXgnKTtcbmNvbnN0IF9fcm9vdFNjb3BlX18gPSBTeW1ib2woJ3Jvb3RTY29wZScpO1xuXG5jb25zdCBfX2FkZEJpbmRpbmdfXyA9IFN5bWJvbCgncmVnaXN0ZXJQcm92aWRlcicpO1xuY29uc3QgX19maW5kUHJvdmlkZXJfXyA9IFN5bWJvbCgnZmluZFByb3ZpZGVyJyk7XG5cbmNsYXNzIFNjb3BlIHtcbiAgLyoqXG4gICAqIFNjb3BlIGNvbnRhaW5pbmcgbG9jYWwgYmluZGluZ3MuXG4gICAqXG4gICAqIEBjbGFzcyBESS5TY29wZVxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtESS5TY29wZX0gW3BhcmVudFNjb3BlPW51bGxdIFRoZSBwYXJlbnQgc2NvcGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJlbnRTY29wZSA9IG51bGwsIHJvb3RTY29wZSA9IHRoaXMpIHtcbiAgICB0aGlzW19fbG9jYWxCaW5kaW5nc19fXSA9IG5ldyBNYXAoKTtcbiAgICB0aGlzW19fcGFyZW50U2NvcGVfX10gPSBwYXJlbnRTY29wZTtcbiAgICB0aGlzW19fcm9vdFNjb3BlX19dID0gcm9vdFNjb3BlO1xuICB9XG5cbiAgW19fYWRkQmluZGluZ19fXShrZXksIGJpbmRpbmcpIHtcbiAgICBpZiAodGhpc1tfX2xvY2FsQmluZGluZ3NfX10uaGFzKGtleSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtrZXl9IGlzIGFscmVhZHkgYm91bmRgKTtcbiAgICB9XG4gICAgdGhpc1tfX2xvY2FsQmluZGluZ3NfX10uc2V0KGtleSwgYmluZGluZyk7XG4gIH1cblxuICBmaW5kQmluZGluZyhrZXkpIHtcbiAgICAvLyBDaGVja3MgdGhlIGxvY2FsIGJpbmRpbmcuXG4gICAgbGV0IGJpbmRpbmcgPSB0aGlzW19fbG9jYWxCaW5kaW5nc19fXS5nZXQoa2V5KTtcbiAgICBpZiAoYmluZGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodGhpc1tfX3BhcmVudFNjb3BlX19dKSB7XG4gICAgICAgIHJldHVybiB0aGlzW19fcGFyZW50U2NvcGVfX10uZmluZEJpbmRpbmcoa2V5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBiaW5kaW5nO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGNoaWxkIHNjb3BlIHdpdGggdGhlIGdpdmVuIHZhbHVlIGJvdW5kIHRvIHRoZSBnaXZlbiBrZXkgaW4gaXRzIGxvY2FsIGJpbmRpbmcuXG4gICAqXG4gICAqIFRPRE8oZ3MpXG4gICAqXG4gICAqIEBtZXRob2Qgd2l0aFxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgdG8gYm91bmQgdGhlIHZhbHVlIHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0ga2V5cyBPYmplY3Qgd2l0aCBtYXBwaW5nIG9mIHZhcmlhYmxlIG5hbWUgdG8gdGhlIGJvdW5kIG5hbWUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBwcm92aWRlciBmdW5jdGlvbiB0byBydW4uXG4gICAqIEByZXR1cm4ge0RJLlNjb3BlfSBUaGUgbmV3bHkgY3JlYXRlZCBjaGlsZCBzY29wZS5cbiAgICovXG4gIHdpdGgoa2V5LCBmbikge1xuICAgIGxldCBjaGlsZFNjb3BlID0gbmV3IFNjb3BlKHRoaXMsIHRoaXNbX19yb290U2NvcGVfX10pO1xuICAgIGxldCBiaW5kaW5nID0gbmV3IEJpbmRpbmcoa2V5LCBmbiwgY2hpbGRTY29wZSk7XG4gICAgY2hpbGRTY29wZVtfX2FkZEJpbmRpbmdfX10oa2V5LCBiaW5kaW5nKTtcbiAgICByZXR1cm4gY2hpbGRTY29wZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGNoaWxkIHNjb3BlIHdpdGggdGhlIGdpdmVuIHZhbHVlIGJvdW5kIHRvIHRoZSBnaXZlbiBrZXkgaW4gaXRzIGxvY2FsIGJpbmRpbmcuXG4gICAqIFRoaXMgaXMgc2ltaWxhciB0byB7eyNjcm9zc0xpbmsgXCJESS5TY29wZS93aXRoXCJ9fXt7L2Nyb3NzTGlua319LCBidXQgdGhlIHZhbHVlIGlzIGEgY29uc3RhbnQuXG4gICAqXG4gICAqIEBtZXRob2QgY29uc3RhbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIGJvdW5kIHRoZSB2YWx1ZSB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIFRoZSBvYmplY3QgdG8gYmluZCB0byB0aGUgZ2l2ZW4ga2V5LlxuICAgKiBAcmV0dXJuIHtESS5TY29wZX0gVGhlIG5ld2x5IGNyZWF0ZWQgY2hpbGQgc2NvcGUuXG4gICAqL1xuICBjb25zdGFudChrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aChrZXksICgpID0+IHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kcyB0aGUgZ2l2ZW4gdmFsdWUgdG8gdGhlIGdpdmVuIGtleS4gVGhlIGV4ZWN1dGlvbiBzY29wZSBvZiB0aGUgcHJvdmlkZXIgZnVuY3Rpb24gaXMgc3RpbGxcbiAgICogdGhpcyBzY29wZS5cbiAgICpcbiAgICogVE9ETyhncylcbiAgICpcbiAgICogQG1ldGhvZCBiaW5kXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byBib3VuZCB0aGUgdmFsdWUgdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBrZXlzIE9iamVjdCB3aXRoIG1hcHBpbmcgb2YgdmFyaWFibGUgbmFtZSB0byB0aGUgYm91bmQgbmFtZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIHByb3ZpZGVyIGZ1bmN0aW9uIHRvIHJ1bi5cbiAgICovXG4gIGJpbmQoa2V5LCBmbikge1xuICAgIGxldCBiaW5kaW5nID0gbmV3IEJpbmRpbmcoa2V5LCBmbiwgdGhpcyk7XG4gICAgdGhpc1tfX3Jvb3RTY29wZV9fXVtfX2FkZEJpbmRpbmdfX10oa2V5LCBiaW5kaW5nKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSdW5zIHRoZSBnaXZlbiBmdW5jdGlvbiBhZnRlciBpbmplY3RpbmcgYW55IGRlcGVuZGVuY2llcy5cbiAgICpcbiAgICogVE9ETyhncylcbiAgICpcbiAgICogQG1ldGhvZCBydW5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIHJ1bi5cbiAgICovXG4gIHJ1bihmbikge1xuICAgIGxldCBydW5CaW5kaW5nID0gbmV3IEJpbmRpbmcobnVsbCwgZm4sIHRoaXMpO1xuXG4gICAgLy8gUmVzb2x2ZXMgYWxsIHRoZSBiaW5kaW5ncyBpbiB0aGUgY3VycmVudCBzY29wZS5cbiAgICBsZXQgcmVzb2x2ZWRWYWx1ZXMgPSBuZXcgUnVuQ29udGV4dCgpO1xuXG4gICAgbGV0IHJlc29sdmVCaW5kaW5ncyA9IGZ1bmN0aW9uKHNjb3BlKSB7XG4gICAgICBmb3IgKGxldCBba2V5LCBiaW5kaW5nXSBvZiBzY29wZVtfX2xvY2FsQmluZGluZ3NfX10pIHtcbiAgICAgICAgYmluZGluZy5yZXNvbHZlKHJlc29sdmVkVmFsdWVzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNjb3BlW19fcGFyZW50U2NvcGVfX10pIHtcbiAgICAgICAgcmVzb2x2ZUJpbmRpbmdzKHNjb3BlW19fcGFyZW50U2NvcGVfX10pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXNvbHZlQmluZGluZ3ModGhpcyk7XG4gICAgcmV0dXJuIHJ1bkJpbmRpbmcucmVzb2x2ZShyZXNvbHZlZFZhbHVlcyk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzW19fbG9jYWxCaW5kaW5nc19fXS5jbGVhcigpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjb3BlO1xuIl19
