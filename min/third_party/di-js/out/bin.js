(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var __binding__ = Symbol();
var __cachedValue__ = Symbol();
var __key__ = Symbol();
var __provider__ = Symbol();
var __scope__ = Symbol();

var Binding = (function () {
  function Binding(key, fn, scope) {
    _classCallCheck(this, Binding);

    this[__key__] = key;
    this[__provider__] = fn;
    this[__scope__] = scope;
  }

  _createClass(Binding, {
    resolve: {
      value: function resolve(runContext) {
        var _this = this;

        var searchChain = arguments[1] === undefined ? [] : arguments[1];

        if (!runContext.has(this[__key__])) {
          (function () {
            var optional = function (key) {
              var binding = _this[__scope__].findBinding(key);

              // Check if the key is already in the search chain.
              if (searchChain.indexOf(key) >= 0) {
                throw new Error("Cyclic dependency:\n" + searchChain.join(" -> ") + " -> " + key);
              }

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

            runContext.set(_this[__key__], _this[__provider__](require, optional));
          })();
        }

        return runContext.get(this[__key__]);
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

var Scope = _interopRequire(require("./scope"));

var Binding = _interopRequire(require("./binding"));

(function (window) {
  window.DIJS = new Scope();
  window.DIJS.Scope = Scope;
  window.DIJS.Scope.Binding = Binding;
})(window);

},{"./binding":1,"./scope":3}],3:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _createComputedClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var prop = props[i]; prop.configurable = true; if (prop.value) prop.writable = true; Object.defineProperty(target, prop.key, prop); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Binding = _interopRequire(require("./binding"));

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
      var binding = new Binding(key, fn, this);
      var childScope = new Scope(this, this[__rootScope__]);
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
      var resolvedValues = new Map();

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

},{"./binding":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZ3NvZWQvcHJvai9kaS1qcy9zcmMvYmluZGluZy5qcyIsIi9Vc2Vycy9nc29lZC9wcm9qL2RpLWpzL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9nc29lZC9wcm9qL2RpLWpzL3NyYy9zY29wZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0FBLElBQU0sV0FBVyxHQUFHLE1BQU0sRUFBRSxDQUFDO0FBQzdCLElBQU0sZUFBZSxHQUFHLE1BQU0sRUFBRSxDQUFDO0FBQ2pDLElBQU0sT0FBTyxHQUFHLE1BQU0sRUFBRSxDQUFDO0FBQ3pCLElBQU0sWUFBWSxHQUFHLE1BQU0sRUFBRSxDQUFDO0FBQzlCLElBQU0sU0FBUyxHQUFHLE1BQU0sRUFBRSxDQUFDOztJQUVyQixPQUFPO0FBQ0EsV0FEUCxPQUFPLENBQ0MsR0FBRyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUU7MEJBRHhCLE9BQU87O0FBRVQsUUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNwQixRQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUM7R0FDekI7O2VBTEcsT0FBTztBQU9YLFdBQU87YUFBQSxpQkFBQyxVQUFVLEVBQW9COzs7WUFBbEIsV0FBVyxnQ0FBRyxFQUFFOztBQUNsQyxZQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRTs7QUFDbEMsZ0JBQUksUUFBUSxHQUFHLFVBQUEsR0FBRyxFQUFJO0FBQ3BCLGtCQUFJLE9BQU8sR0FBRyxNQUFLLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7O0FBRy9DLGtCQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FB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Ozs7Ozs7Ozs7OztXQVVFLGFBQUMsRUFBRSxFQUFFO0FBQ04sVUFBSSxVQUFVLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQzs7O0FBRzdDLFVBQUksY0FBYyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRS9CLFVBQUksZUFBZTs7Ozs7Ozs7OztTQUFHLFVBQVMsS0FBSyxFQUFFOzs7Ozs7QUFDcEMsK0JBQTJCLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQzs7O2dCQUF6QyxHQUFHO2dCQUFFLE9BQU87O0FBQ3BCLG1CQUFPLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1dBQ2pDOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsWUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQUU7QUFDMUIseUJBQWUsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztTQUN6QztPQUNGLENBQUEsQ0FBQzs7QUFFRixxQkFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RCLGFBQU8sVUFBVSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUMzQzs7O1dBRUksaUJBQUc7QUFDTixVQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNqQzs7O1NBakhHLEtBQUs7OztpQkFvSEksS0FBSyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBfX2JpbmRpbmdfXyA9IFN5bWJvbCgpO1xuY29uc3QgX19jYWNoZWRWYWx1ZV9fID0gU3ltYm9sKCk7XG5jb25zdCBfX2tleV9fID0gU3ltYm9sKCk7XG5jb25zdCBfX3Byb3ZpZGVyX18gPSBTeW1ib2woKTtcbmNvbnN0IF9fc2NvcGVfXyA9IFN5bWJvbCgpO1xuXG5jbGFzcyBCaW5kaW5nIHtcbiAgY29uc3RydWN0b3Ioa2V5LCBmbiwgc2NvcGUpIHtcbiAgICB0aGlzW19fa2V5X19dID0ga2V5O1xuICAgIHRoaXNbX19wcm92aWRlcl9fXSA9IGZuO1xuICAgIHRoaXNbX19zY29wZV9fXSA9IHNjb3BlO1xuICB9XG5cbiAgcmVzb2x2ZShydW5Db250ZXh0LCBzZWFyY2hDaGFpbiA9IFtdKSB7XG4gICAgaWYgKCFydW5Db250ZXh0Lmhhcyh0aGlzW19fa2V5X19dKSkge1xuICAgICAgbGV0IG9wdGlvbmFsID0ga2V5ID0+IHtcbiAgICAgICAgbGV0IGJpbmRpbmcgPSB0aGlzW19fc2NvcGVfX10uZmluZEJpbmRpbmcoa2V5KTtcblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUga2V5IGlzIGFscmVhZHkgaW4gdGhlIHNlYXJjaCBjaGFpbi5cbiAgICAgICAgaWYgKHNlYXJjaENoYWluLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDeWNsaWMgZGVwZW5kZW5jeTpcXG4ke3NlYXJjaENoYWluLmpvaW4oJyAtPiAnKX0gLT4gJHtrZXl9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYmluZGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gYmluZGluZy5yZXNvbHZlKHJ1bkNvbnRleHQsIHNlYXJjaENoYWluLmNvbmNhdChba2V5XSkpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBsZXQgcmVxdWlyZSA9IGtleSA9PiB7XG4gICAgICAgIGxldCB2YWx1ZSA9IG9wdGlvbmFsKGtleSk7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCAke2tleX06XFxuJHtzZWFyY2hDaGFpbi5qb2luKCcgLT4gJyl9IC0+ICR7a2V5fWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH07XG5cbiAgICAgIHJ1bkNvbnRleHQuc2V0KHRoaXNbX19rZXlfX10sIHRoaXNbX19wcm92aWRlcl9fXShyZXF1aXJlLCBvcHRpb25hbCkpO1xuICAgIH1cblxuICAgIHJldHVybiBydW5Db250ZXh0LmdldCh0aGlzW19fa2V5X19dKTtcbiAgfVxuXG4gIGdldCBwcm92aWRlcigpIHtcbiAgICByZXR1cm4gdGhpc1tfX3Byb3ZpZGVyX19dO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJpbmRpbmc7XG4iLCJpbXBvcnQgU2NvcGUgZnJvbSAnLi9zY29wZSc7XG5pbXBvcnQgQmluZGluZyBmcm9tICcuL2JpbmRpbmcnO1xuXG4oKHdpbmRvdykgPT4ge1xuICB3aW5kb3dbJ0RJSlMnXSA9IG5ldyBTY29wZSgpO1xuICB3aW5kb3dbJ0RJSlMnXVsnU2NvcGUnXSA9IFNjb3BlO1xuICB3aW5kb3dbJ0RJSlMnXVsnU2NvcGUnXVsnQmluZGluZyddID0gQmluZGluZztcbn0pKHdpbmRvdyk7XG4iLCJpbXBvcnQgQmluZGluZyBmcm9tICcuL2JpbmRpbmcnO1xuXG4vLyBQcml2YXRlIHN5bWJvbHMuXG5jb25zdCBfX2xvY2FsQmluZGluZ3NfXyA9IFN5bWJvbCgnbG9jYWxCaW5kaW5ncycpO1xuY29uc3QgX19wYXJlbnRTY29wZV9fID0gU3ltYm9sKCdwYXJlbnRTY29wZScpO1xuY29uc3QgX19wcmVmaXhfXyA9IFN5bWJvbCgncHJlZml4Jyk7XG5jb25zdCBfX3Jvb3RTY29wZV9fID0gU3ltYm9sKCdyb290U2NvcGUnKTtcblxuY29uc3QgX19hZGRCaW5kaW5nX18gPSBTeW1ib2woJ3JlZ2lzdGVyUHJvdmlkZXInKTtcbmNvbnN0IF9fZmluZFByb3ZpZGVyX18gPSBTeW1ib2woJ2ZpbmRQcm92aWRlcicpO1xuXG5jbGFzcyBTY29wZSB7XG4gIC8qKlxuICAgKiBTY29wZSBjb250YWluaW5nIGxvY2FsIGJpbmRpbmdzLlxuICAgKlxuICAgKiBAY2xhc3MgREkuU2NvcGVcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7REkuU2NvcGV9IFtwYXJlbnRTY29wZT1udWxsXSBUaGUgcGFyZW50IHNjb3BlLlxuICAgKi9cbiAgY29uc3RydWN0b3IocGFyZW50U2NvcGUgPSBudWxsLCByb290U2NvcGUgPSB0aGlzKSB7XG4gICAgdGhpc1tfX2xvY2FsQmluZGluZ3NfX10gPSBuZXcgTWFwKCk7XG4gICAgdGhpc1tfX3BhcmVudFNjb3BlX19dID0gcGFyZW50U2NvcGU7XG4gICAgdGhpc1tfX3Jvb3RTY29wZV9fXSA9IHJvb3RTY29wZTtcbiAgfVxuXG4gIFtfX2FkZEJpbmRpbmdfX10oa2V5LCBiaW5kaW5nKSB7XG4gICAgaWYgKHRoaXNbX19sb2NhbEJpbmRpbmdzX19dLmhhcyhrZXkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7a2V5fSBpcyBhbHJlYWR5IGJvdW5kYCk7XG4gICAgfVxuICAgIHRoaXNbX19sb2NhbEJpbmRpbmdzX19dLnNldChrZXksIGJpbmRpbmcpO1xuICB9XG5cbiAgZmluZEJpbmRpbmcoa2V5KSB7XG4gICAgLy8gQ2hlY2tzIHRoZSBsb2NhbCBiaW5kaW5nLlxuICAgIGxldCBiaW5kaW5nID0gdGhpc1tfX2xvY2FsQmluZGluZ3NfX10uZ2V0KGtleSk7XG4gICAgaWYgKGJpbmRpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHRoaXNbX19wYXJlbnRTY29wZV9fXSkge1xuICAgICAgICByZXR1cm4gdGhpc1tfX3BhcmVudFNjb3BlX19dLmZpbmRCaW5kaW5nKGtleSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYmluZGluZztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBjaGlsZCBzY29wZSB3aXRoIHRoZSBnaXZlbiB2YWx1ZSBib3VuZCB0byB0aGUgZ2l2ZW4ga2V5IGluIGl0cyBsb2NhbCBiaW5kaW5nLlxuICAgKlxuICAgKiBUT0RPKGdzKVxuICAgKlxuICAgKiBAbWV0aG9kIHdpdGhcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIGJvdW5kIHRoZSB2YWx1ZSB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IGtleXMgT2JqZWN0IHdpdGggbWFwcGluZyBvZiB2YXJpYWJsZSBuYW1lIHRvIHRoZSBib3VuZCBuYW1lLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgcHJvdmlkZXIgZnVuY3Rpb24gdG8gcnVuLlxuICAgKiBAcmV0dXJuIHtESS5TY29wZX0gVGhlIG5ld2x5IGNyZWF0ZWQgY2hpbGQgc2NvcGUuXG4gICAqL1xuICB3aXRoKGtleSwgZm4pIHtcbiAgICBsZXQgYmluZGluZyA9IG5ldyBCaW5kaW5nKGtleSwgZm4sIHRoaXMpO1xuICAgIGxldCBjaGlsZFNjb3BlID0gbmV3IFNjb3BlKHRoaXMsIHRoaXNbX19yb290U2NvcGVfX10pO1xuICAgIGNoaWxkU2NvcGVbX19hZGRCaW5kaW5nX19dKGtleSwgYmluZGluZyk7XG4gICAgcmV0dXJuIGNoaWxkU2NvcGU7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBjaGlsZCBzY29wZSB3aXRoIHRoZSBnaXZlbiB2YWx1ZSBib3VuZCB0byB0aGUgZ2l2ZW4ga2V5IGluIGl0cyBsb2NhbCBiaW5kaW5nLlxuICAgKiBUaGlzIGlzIHNpbWlsYXIgdG8ge3sjY3Jvc3NMaW5rIFwiREkuU2NvcGUvd2l0aFwifX17ey9jcm9zc0xpbmt9fSwgYnV0IHRoZSB2YWx1ZSBpcyBhIGNvbnN0YW50LlxuICAgKlxuICAgKiBAbWV0aG9kIGNvbnN0YW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byBib3VuZCB0aGUgdmFsdWUgdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSBUaGUgb2JqZWN0IHRvIGJpbmQgdG8gdGhlIGdpdmVuIGtleS5cbiAgICogQHJldHVybiB7REkuU2NvcGV9IFRoZSBuZXdseSBjcmVhdGVkIGNoaWxkIHNjb3BlLlxuICAgKi9cbiAgY29uc3RhbnQoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLndpdGgoa2V5LCAoKSA9PiB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQmluZHMgdGhlIGdpdmVuIHZhbHVlIHRvIHRoZSBnaXZlbiBrZXkuIFRoZSBleGVjdXRpb24gc2NvcGUgb2YgdGhlIHByb3ZpZGVyIGZ1bmN0aW9uIGlzIHN0aWxsXG4gICAqIHRoaXMgc2NvcGUuXG4gICAqXG4gICAqIFRPRE8oZ3MpXG4gICAqXG4gICAqIEBtZXRob2QgYmluZFxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgdG8gYm91bmQgdGhlIHZhbHVlIHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0ga2V5cyBPYmplY3Qgd2l0aCBtYXBwaW5nIG9mIHZhcmlhYmxlIG5hbWUgdG8gdGhlIGJvdW5kIG5hbWUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBwcm92aWRlciBmdW5jdGlvbiB0byBydW4uXG4gICAqL1xuICBiaW5kKGtleSwgZm4pIHtcbiAgICBsZXQgYmluZGluZyA9IG5ldyBCaW5kaW5nKGtleSwgZm4sIHRoaXMpO1xuICAgIHRoaXNbX19yb290U2NvcGVfX11bX19hZGRCaW5kaW5nX19dKGtleSwgYmluZGluZyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUnVucyB0aGUgZ2l2ZW4gZnVuY3Rpb24gYWZ0ZXIgaW5qZWN0aW5nIGFueSBkZXBlbmRlbmNpZXMuXG4gICAqXG4gICAqIFRPRE8oZ3MpXG4gICAqXG4gICAqIEBtZXRob2QgcnVuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBydW4uXG4gICAqL1xuICBydW4oZm4pIHtcbiAgICBsZXQgcnVuQmluZGluZyA9IG5ldyBCaW5kaW5nKG51bGwsIGZuLCB0aGlzKTtcblxuICAgIC8vIFJlc29sdmVzIGFsbCB0aGUgYmluZGluZ3MgaW4gdGhlIGN1cnJlbnQgc2NvcGUuXG4gICAgbGV0IHJlc29sdmVkVmFsdWVzID0gbmV3IE1hcCgpO1xuXG4gICAgbGV0IHJlc29sdmVCaW5kaW5ncyA9IGZ1bmN0aW9uKHNjb3BlKSB7XG4gICAgICBmb3IgKGxldCBba2V5LCBiaW5kaW5nXSBvZiBzY29wZVtfX2xvY2FsQmluZGluZ3NfX10pIHtcbiAgICAgICAgYmluZGluZy5yZXNvbHZlKHJlc29sdmVkVmFsdWVzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNjb3BlW19fcGFyZW50U2NvcGVfX10pIHtcbiAgICAgICAgcmVzb2x2ZUJpbmRpbmdzKHNjb3BlW19fcGFyZW50U2NvcGVfX10pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXNvbHZlQmluZGluZ3ModGhpcyk7XG4gICAgcmV0dXJuIHJ1bkJpbmRpbmcucmVzb2x2ZShyZXNvbHZlZFZhbHVlcyk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzW19fbG9jYWxCaW5kaW5nc19fXS5jbGVhcigpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjb3BlO1xuIl19
