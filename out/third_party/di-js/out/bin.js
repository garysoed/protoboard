(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Scope = _interopRequire(require("./scope"));

(function (window) {
  window.DIJS = new Scope("(root)", null, /* provider */new Map());
  window.DIJS.Scope = Scope;
})(window);

},{"./scope":2}],2:[function(require,module,exports){
"use strict";

var _createComputedClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var prop = props[i]; prop.configurable = true; if (prop.value) prop.writable = true; Object.defineProperty(target, prop.key, prop); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var __globalBindings__ = Symbol("globalBindings");
var __name__ = Symbol("name");
var __parentScope__ = Symbol("parentScope");
var __provider__ = Symbol("provider");
var __resolve__ = Symbol("resolve");
var __searchAncestor__ = Symbol("searchAncestor");

var Scope = (function () {

  /**
   * Represents a binding scope.
   *
   * @class dijs.Scope
   * @constructor
   * @param {string} name Name of this scope.
   * @param {Function} provider Provider bound to this scope.
   * @param {Map} globalBindings Reference to the global bindings.
   * @param {dijs.Scope} [parentScope] The parent scope object. Defaults to null.
   */

  function Scope(name, provider, globalBindings) {
    var parentScope = arguments[3] === undefined ? null : arguments[3];

    _classCallCheck(this, Scope);

    this[__name__] = name;
    this[__provider__] = provider;
    this[__globalBindings__] = globalBindings;
    this[__parentScope__] = parentScope;
  }

  _createComputedClass(Scope, [{
    key: __searchAncestor__,

    /**
     * Searches the ancestor for a scope with the given name.
     *
     * @method __searchAncestor__
     * @param {string} name Name of the scope to be returned.
     * @return {dijs.Scope} Ancestor scope, or the current scope, with the given name. Or undefined if
     *    no scopes can be found.
     * @private
     */
    value: function (name) {
      if (this[__name__] === name) {
        return this;
      } else if (this[__parentScope__]) {
        return this[__parentScope__][__searchAncestor__](name);
      } else {
        return undefined;
      }
    }
  }, {
    key: __resolve__,

    /**
     * Runs the provider bound to the given key and return its value.
     *
     * @method resolve
     * @param {string} key Key of the bound provider to be ran.
     * @param {dijs.Scope} [runScope] The scope to run the provider in. Any local bindings to this
     *    scope will override any global bindings in the run context.
     * @param {Map} [runContext] Cache of resolved keys during this run. Defaults to empty map.
     * @param {Array} [resolveChain] Array of keys to keep track of the resolution chain. This is
     *    used for cyclic dependency. Defaults to empty array.
     * @return {Object} The value bound to the given key.
     * @private
     */
    value: function (key) {
      var runScope = arguments[1] === undefined ? this : arguments[1];
      var runContext = arguments[2] === undefined ? new Map() : arguments[2];
      var resolveChain = arguments[3] === undefined ? [] : arguments[3];

      // Check if the key is already in the search chain.
      if (resolveChain.indexOf(key) >= 0) {
        throw new Error("Cyclic dependency:\n" + resolveChain.join(" -> ") + " -> " + key);
      }

      var childSearchChain = resolveChain.concat([key]);

      // First, find the ancestral scope.
      var scope = this[__searchAncestor__](key);

      // Second, find in the running scope.
      if (scope === undefined) {
        scope = runScope[__searchAncestor__](key);
      }

      // Finally, search in the global bindings.
      if (scope === undefined && this[__globalBindings__].has(key)) {
        scope = this[__globalBindings__].get(key);
      }

      if (scope === undefined) {
        return undefined;
      }

      if (!runContext.has(scope)) {
        (function () {
          var optional = function (key) {
            return scope[__resolve__](key, runScope, runContext, childSearchChain);
          };
          var require = function (key) {
            var value = optional(key);
            if (value === undefined) {
              throw new Error("Cannot find " + key + ":\n" + resolveChain.join(" -> ") + " -> " + key);
            }
            return value;
          };

          runContext.set(scope, scope[__provider__](require, optional));
        })();
      }

      return runContext.get(scope);
    }
  }, {
    key: "with",

    /**
     * Locally binds the given provider to the given key.
     *
     * @method with
     * @param {string} key The key to bind the provider to.
     * @param {Function} provider The provider function to bind.
     * @return {dijs.Scope} The child scope with the bound provider.
     */
    value: function _with(key, provider) {
      return new Scope(key, provider, this[__globalBindings__], this);
    }
  }, {
    key: "constant",

    /**
     * Locally bind the given constant to the given key.
     *
     * @method constant
     * @param {string} key The key to bind the constant to.
     * @param {Object} value The constant to bind.
     * @return {dijs.Scope} The child scope with the bound constant.
     */
    value: function constant(key, value) {
      return this["with"](key, function () {
        return value;
      });
    }
  }, {
    key: "bind",

    /**
     * Globally binds the given provider to the given key.
     *
     * @method bind
     * @param {string} key The key to bind the provider to.
     * @param {Function} fn The provider function to bind.
     * @return {dijs.Scope} This scope for chaining.
     */
    value: function bind(key, fn) {
      var newScope = this["with"](key, fn);
      if (this[__globalBindings__].has(key)) {
        throw new Error("Key ${key} is already bound");
      }
      this[__globalBindings__].set(key, newScope);
      return this;
    }
  }, {
    key: "run",

    /**
     * Runs the given provider.
     *
     * @method run
     * @param {Function} fn The provider to run.
     * @return {Object} The value returned by the provider.
     */
    value: function run(fn) {
      return this["with"]("(run)", fn)[__resolve__]("(run)");
    }
  }, {
    key: "toString",

    /**
     * Pretty prints this scope.
     *
     * @method toString
     * @return {string} Pretty printed string of this scope.
     */
    value: function toString() {
      var parentStrPart = this[__parentScope__] ? [this[__parentScope__].toString()] : [];
      return [this[__name__]].concat(parentStrPart).join(" -> ");
    }
  }, {
    key: "reset",

    /**
     * Clears any global bindings.
     *
     * @method reset
     */
    value: function reset() {
      this[__globalBindings__].clear();
    }
  }, {
    key: "export",

    /**
     * Resolves the given key in a new run context and exports the result globally.
     *
     * @method export
     * @param {string} key Key to be resolved.
     * @param {string} exportKey `.` separated path to export the value to.
     * @return {dijs.Scope} This object for chaining.
     */
    value: function _export(key, exportKey) {
      var parts = exportKey.split(".");
      var lastPart = parts.pop();
      var exportObject = window;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = parts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var part = _step.value;

          if (!exportObject[part]) {
            exportObject[part] = {};
          }
          exportObject = exportObject[part];
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

      exportObject[lastPart] = this[__resolve__](key);
      return this;
    }
  }]);

  return Scope;
})();

module.exports = Scope;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZ3NvZWQvcHJvai9kaS1qcy9zcmMvaW5kZXguanMiLCIvVXNlcnMvZ3NvZWQvcHJvai9kaS1qcy9zcmMvc2NvcGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0lDQU8sS0FBSywyQkFBTSxTQUFTOztBQUUzQixDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQ1gsUUFBTSxLQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksZ0JBQWlCLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNyRSxRQUFNLEtBQVEsTUFBUyxHQUFHLEtBQUssQ0FBQztDQUNqQyxDQUFBLENBQUUsTUFBTSxDQUFDLENBQUM7Ozs7Ozs7OztBQ0xYLElBQU0sa0JBQWtCLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDcEQsSUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hDLElBQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM5QyxJQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RDLElBQU0sa0JBQWtCLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0lBRTlDLEtBQUs7Ozs7Ozs7Ozs7Ozs7QUFZRSxXQVpQLEtBQUssQ0FZRyxJQUFJLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBc0I7UUFBcEIsV0FBVyxnQ0FBRyxJQUFJOzswQkFaMUQsS0FBSzs7QUFhUCxRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxRQUFRLENBQUM7QUFDOUIsUUFBSSxDQUFDLGtCQUFr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QVEsR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDM0IsVUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDOzs7Ozs7O0FBRTFCLDZCQUFpQixLQUFLO2NBQWIsSUFBSTs7QUFDWCxjQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3ZCLHdCQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1dBQ3pCO0FBQ0Qsc0JBQVksR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbkM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxrQkFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRCxhQUFPLElBQUksQ0FBQztLQUNiOzs7U0E1TEcsS0FBSzs7O2lCQStMSSxLQUFLIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBTY29wZSBmcm9tICcuL3Njb3BlJztcblxuKCh3aW5kb3cpID0+IHtcbiAgd2luZG93WydESUpTJ10gPSBuZXcgU2NvcGUoJyhyb290KScsIG51bGwgLyogcHJvdmlkZXIgKi8sIG5ldyBNYXAoKSk7XG4gIHdpbmRvd1snRElKUyddWydTY29wZSddID0gU2NvcGU7XG59KSh3aW5kb3cpO1xuIiwiY29uc3QgX19nbG9iYWxCaW5kaW5nc19fID0gU3ltYm9sKCdnbG9iYWxCaW5kaW5ncycpO1xuY29uc3QgX19uYW1lX18gPSBTeW1ib2woJ25hbWUnKTtcbmNvbnN0IF9fcGFyZW50U2NvcGVfXyA9IFN5bWJvbCgncGFyZW50U2NvcGUnKTtcbmNvbnN0IF9fcHJvdmlkZXJfXyA9IFN5bWJvbCgncHJvdmlkZXInKTtcbmNvbnN0IF9fcmVzb2x2ZV9fID0gU3ltYm9sKCdyZXNvbHZlJyk7XG5jb25zdCBfX3NlYXJjaEFuY2VzdG9yX18gPSBTeW1ib2woJ3NlYXJjaEFuY2VzdG9yJyk7XG5cbmNsYXNzIFNjb3BlIHtcblxuICAvKipcbiAgICogUmVwcmVzZW50cyBhIGJpbmRpbmcgc2NvcGUuXG4gICAqXG4gICAqIEBjbGFzcyBkaWpzLlNjb3BlXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBOYW1lIG9mIHRoaXMgc2NvcGUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHByb3ZpZGVyIFByb3ZpZGVyIGJvdW5kIHRvIHRoaXMgc2NvcGUuXG4gICAqIEBwYXJhbSB7TWFwfSBnbG9iYWxCaW5kaW5ncyBSZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBiaW5kaW5ncy5cbiAgICogQHBhcmFtIHtkaWpzLlNjb3BlfSBbcGFyZW50U2NvcGVdIFRoZSBwYXJlbnQgc2NvcGUgb2JqZWN0LiBEZWZhdWx0cyB0byBudWxsLlxuICAgKi9cbiAgY29uc3RydWN0b3IobmFtZSwgcHJvdmlkZXIsIGdsb2JhbEJpbmRpbmdzLCBwYXJlbnRTY29wZSA9IG51bGwpIHtcbiAgICB0aGlzW19fbmFtZV9fXSA9IG5hbWU7XG4gICAgdGhpc1tfX3Byb3ZpZGVyX19dID0gcHJvdmlkZXI7XG4gICAgdGhpc1tfX2dsb2JhbEJpbmRpbmdzX19dID0gZ2xvYmFsQmluZGluZ3M7XG4gICAgdGhpc1tfX3BhcmVudFNjb3BlX19dID0gcGFyZW50U2NvcGU7XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoZXMgdGhlIGFuY2VzdG9yIGZvciBhIHNjb3BlIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICAqXG4gICAqIEBtZXRob2QgX19zZWFyY2hBbmNlc3Rvcl9fXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHNjb3BlIHRvIGJlIHJldHVybmVkLlxuICAgKiBAcmV0dXJuIHtkaWpzLlNjb3BlfSBBbmNlc3RvciBzY29wZSwgb3IgdGhlIGN1cnJlbnQgc2NvcGUsIHdpdGggdGhlIGdpdmVuIG5hbWUuIE9yIHVuZGVmaW5lZCBpZlxuICAgKiAgICBubyBzY29wZXMgY2FuIGJlIGZvdW5kLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgW19fc2VhcmNoQW5jZXN0b3JfX10obmFtZSkge1xuICAgIGlmICh0aGlzW19fbmFtZV9fXSA9PT0gbmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIGlmICh0aGlzW19fcGFyZW50U2NvcGVfX10pe1xuICAgICAgcmV0dXJuIHRoaXNbX19wYXJlbnRTY29wZV9fXVtfX3NlYXJjaEFuY2VzdG9yX19dKG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSdW5zIHRoZSBwcm92aWRlciBib3VuZCB0byB0aGUgZ2l2ZW4ga2V5IGFuZCByZXR1cm4gaXRzIHZhbHVlLlxuICAgKlxuICAgKiBAbWV0aG9kIHJlc29sdmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBLZXkgb2YgdGhlIGJvdW5kIHByb3ZpZGVyIHRvIGJlIHJhbi5cbiAgICogQHBhcmFtIHtkaWpzLlNjb3BlfSBbcnVuU2NvcGVdIFRoZSBzY29wZSB0byBydW4gdGhlIHByb3ZpZGVyIGluLiBBbnkgbG9jYWwgYmluZGluZ3MgdG8gdGhpc1xuICAgKiAgICBzY29wZSB3aWxsIG92ZXJyaWRlIGFueSBnbG9iYWwgYmluZGluZ3MgaW4gdGhlIHJ1biBjb250ZXh0LlxuICAgKiBAcGFyYW0ge01hcH0gW3J1bkNvbnRleHRdIENhY2hlIG9mIHJlc29sdmVkIGtleXMgZHVyaW5nIHRoaXMgcnVuLiBEZWZhdWx0cyB0byBlbXB0eSBtYXAuXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtyZXNvbHZlQ2hhaW5dIEFycmF5IG9mIGtleXMgdG8ga2VlcCB0cmFjayBvZiB0aGUgcmVzb2x1dGlvbiBjaGFpbi4gVGhpcyBpc1xuICAgKiAgICB1c2VkIGZvciBjeWNsaWMgZGVwZW5kZW5jeS4gRGVmYXVsdHMgdG8gZW1wdHkgYXJyYXkuXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIHZhbHVlIGJvdW5kIHRvIHRoZSBnaXZlbiBrZXkuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBbX19yZXNvbHZlX19dKGtleSwgcnVuU2NvcGUgPSB0aGlzLCBydW5Db250ZXh0ID0gbmV3IE1hcCgpLCByZXNvbHZlQ2hhaW4gPSBbXSkge1xuICAgIC8vIENoZWNrIGlmIHRoZSBrZXkgaXMgYWxyZWFkeSBpbiB0aGUgc2VhcmNoIGNoYWluLlxuICAgIGlmIChyZXNvbHZlQ2hhaW4uaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ3ljbGljIGRlcGVuZGVuY3k6XFxuJHtyZXNvbHZlQ2hhaW4uam9pbignIC0+ICcpfSAtPiAke2tleX1gKTtcbiAgICB9XG5cbiAgICBsZXQgY2hpbGRTZWFyY2hDaGFpbiA9IHJlc29sdmVDaGFpbi5jb25jYXQoW2tleV0pO1xuXG4gICAgLy8gRmlyc3QsIGZpbmQgdGhlIGFuY2VzdHJhbCBzY29wZS5cbiAgICBsZXQgc2NvcGUgPSB0aGlzW19fc2VhcmNoQW5jZXN0b3JfX10oa2V5KTtcblxuICAgIC8vIFNlY29uZCwgZmluZCBpbiB0aGUgcnVubmluZyBzY29wZS5cbiAgICBpZiAoc2NvcGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgc2NvcGUgPSBydW5TY29wZVtfX3NlYXJjaEFuY2VzdG9yX19dKGtleSk7XG4gICAgfVxuXG4gICAgLy8gRmluYWxseSwgc2VhcmNoIGluIHRoZSBnbG9iYWwgYmluZGluZ3MuXG4gICAgaWYgKHNjb3BlID09PSB1bmRlZmluZWQgJiYgdGhpc1tfX2dsb2JhbEJpbmRpbmdzX19dLmhhcyhrZXkpKSB7XG4gICAgICBzY29wZSA9IHRoaXNbX19nbG9iYWxCaW5kaW5nc19fXS5nZXQoa2V5KTtcbiAgICB9XG5cbiAgICBpZiAoc2NvcGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAoIXJ1bkNvbnRleHQuaGFzKHNjb3BlKSkge1xuICAgICAgbGV0IG9wdGlvbmFsID0ga2V5ID0+IHtcbiAgICAgICAgcmV0dXJuIHNjb3BlW19fcmVzb2x2ZV9fXShrZXksIHJ1blNjb3BlLCBydW5Db250ZXh0LCBjaGlsZFNlYXJjaENoYWluKTtcbiAgICAgIH07XG4gICAgICBsZXQgcmVxdWlyZSA9IGtleSA9PiB7XG4gICAgICAgIGxldCB2YWx1ZSA9IG9wdGlvbmFsKGtleSk7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCAke2tleX06XFxuJHtyZXNvbHZlQ2hhaW4uam9pbignIC0+ICcpfSAtPiAke2tleX1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9O1xuXG4gICAgICBydW5Db250ZXh0LnNldChzY29wZSwgc2NvcGVbX19wcm92aWRlcl9fXShyZXF1aXJlLCBvcHRpb25hbCkpO1xuICAgIH1cblxuICAgIHJldHVybiBydW5Db250ZXh0LmdldChzY29wZSk7XG4gIH1cblxuICAvKipcbiAgICogTG9jYWxseSBiaW5kcyB0aGUgZ2l2ZW4gcHJvdmlkZXIgdG8gdGhlIGdpdmVuIGtleS5cbiAgICpcbiAgICogQG1ldGhvZCB3aXRoXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byBiaW5kIHRoZSBwcm92aWRlciB0by5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcHJvdmlkZXIgVGhlIHByb3ZpZGVyIGZ1bmN0aW9uIHRvIGJpbmQuXG4gICAqIEByZXR1cm4ge2RpanMuU2NvcGV9IFRoZSBjaGlsZCBzY29wZSB3aXRoIHRoZSBib3VuZCBwcm92aWRlci5cbiAgICovXG4gIHdpdGgoa2V5LCBwcm92aWRlcikge1xuICAgIHJldHVybiBuZXcgU2NvcGUoa2V5LCBwcm92aWRlciwgdGhpc1tfX2dsb2JhbEJpbmRpbmdzX19dLCB0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2NhbGx5IGJpbmQgdGhlIGdpdmVuIGNvbnN0YW50IHRvIHRoZSBnaXZlbiBrZXkuXG4gICAqXG4gICAqIEBtZXRob2QgY29uc3RhbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIGJpbmQgdGhlIGNvbnN0YW50IHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWUgVGhlIGNvbnN0YW50IHRvIGJpbmQuXG4gICAqIEByZXR1cm4ge2RpanMuU2NvcGV9IFRoZSBjaGlsZCBzY29wZSB3aXRoIHRoZSBib3VuZCBjb25zdGFudC5cbiAgICovXG4gIGNvbnN0YW50KGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoKGtleSwgKCkgPT4gdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdsb2JhbGx5IGJpbmRzIHRoZSBnaXZlbiBwcm92aWRlciB0byB0aGUgZ2l2ZW4ga2V5LlxuICAgKlxuICAgKiBAbWV0aG9kIGJpbmRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIGJpbmQgdGhlIHByb3ZpZGVyIHRvLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgcHJvdmlkZXIgZnVuY3Rpb24gdG8gYmluZC5cbiAgICogQHJldHVybiB7ZGlqcy5TY29wZX0gVGhpcyBzY29wZSBmb3IgY2hhaW5pbmcuXG4gICAqL1xuICBiaW5kKGtleSwgZm4pIHtcbiAgICBsZXQgbmV3U2NvcGUgPSB0aGlzLndpdGgoa2V5LCBmbik7XG4gICAgaWYgKHRoaXNbX19nbG9iYWxCaW5kaW5nc19fXS5oYXMoa2V5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZXkgJHtrZXl9IGlzIGFscmVhZHkgYm91bmQnKTtcbiAgICB9XG4gICAgdGhpc1tfX2dsb2JhbEJpbmRpbmdzX19dLnNldChrZXksIG5ld1Njb3BlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSdW5zIHRoZSBnaXZlbiBwcm92aWRlci5cbiAgICpcbiAgICogQG1ldGhvZCBydW5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIHByb3ZpZGVyIHRvIHJ1bi5cbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgdmFsdWUgcmV0dXJuZWQgYnkgdGhlIHByb3ZpZGVyLlxuICAgKi9cbiAgcnVuKGZuKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aCgnKHJ1biknLCBmbilbX19yZXNvbHZlX19dKCcocnVuKScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXR0eSBwcmludHMgdGhpcyBzY29wZS5cbiAgICpcbiAgICogQG1ldGhvZCB0b1N0cmluZ1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9IFByZXR0eSBwcmludGVkIHN0cmluZyBvZiB0aGlzIHNjb3BlLlxuICAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IHBhcmVudFN0clBhcnQgPSB0aGlzW19fcGFyZW50U2NvcGVfX10gPyBbdGhpc1tfX3BhcmVudFNjb3BlX19dLnRvU3RyaW5nKCldIDogW107XG4gICAgcmV0dXJuIFt0aGlzW19fbmFtZV9fXV0uY29uY2F0KHBhcmVudFN0clBhcnQpLmpvaW4oJyAtPiAnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYW55IGdsb2JhbCBiaW5kaW5ncy5cbiAgICpcbiAgICogQG1ldGhvZCByZXNldFxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpc1tfX2dsb2JhbEJpbmRpbmdzX19dLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZXMgdGhlIGdpdmVuIGtleSBpbiBhIG5ldyBydW4gY29udGV4dCBhbmQgZXhwb3J0cyB0aGUgcmVzdWx0IGdsb2JhbGx5LlxuICAgKlxuICAgKiBAbWV0aG9kIGV4cG9ydFxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IEtleSB0byBiZSByZXNvbHZlZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGV4cG9ydEtleSBgLmAgc2VwYXJhdGVkIHBhdGggdG8gZXhwb3J0IHRoZSB2YWx1ZSB0by5cbiAgICogQHJldHVybiB7ZGlqcy5TY29wZX0gVGhpcyBvYmplY3QgZm9yIGNoYWluaW5nLlxuICAgKi9cbiAgZXhwb3J0KGtleSwgZXhwb3J0S2V5KSB7XG4gICAgbGV0IHBhcnRzID0gZXhwb3J0S2V5LnNwbGl0KCcuJyk7XG4gICAgbGV0IGxhc3RQYXJ0ID0gcGFydHMucG9wKCk7XG4gICAgbGV0IGV4cG9ydE9iamVjdCA9IHdpbmRvdztcblxuICAgIGZvciAobGV0IHBhcnQgb2YgcGFydHMpIHtcbiAgICAgIGlmICghZXhwb3J0T2JqZWN0W3BhcnRdKSB7XG4gICAgICAgIGV4cG9ydE9iamVjdFtwYXJ0XSA9IHt9O1xuICAgICAgfVxuICAgICAgZXhwb3J0T2JqZWN0ID0gZXhwb3J0T2JqZWN0W3BhcnRdO1xuICAgIH1cblxuICAgIGV4cG9ydE9iamVjdFtsYXN0UGFydF0gPSB0aGlzW19fcmVzb2x2ZV9fXShrZXkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjb3BlO1xuIl19
