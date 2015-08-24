(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Scope = _interopRequire(require("./scope"));

(function (window) {
  window.DIJS = new Scope();
  window.DIJS.Scope = Scope;
})(window);

},{"./scope":2}],2:[function(require,module,exports){
"use strict";

var _createComputedClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var prop = props[i]; prop.configurable = true; if (prop.value) prop.writable = true; Object.defineProperty(target, prop.key, prop); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var __globalBindings__ = Symbol("globalBindings");
var __key__ = Symbol("key");
var __parentScope__ = Symbol("parentScope");
var __provider__ = Symbol("provider");
var __searchAncestor__ = Symbol("searchAncestor");

var Scope = (function () {
  function Scope() {
    var provider = arguments[0] === undefined ? null : arguments[0];
    var key = arguments[1] === undefined ? "(root)" : arguments[1];
    var parentScope = arguments[2] === undefined ? null : arguments[2];
    var globalBindings = arguments[3] === undefined ? new Map() : arguments[3];

    _classCallCheck(this, Scope);

    this[__globalBindings__] = globalBindings;
    this[__key__] = key;
    this[__parentScope__] = parentScope;
    this[__provider__] = provider;
  }

  _createComputedClass(Scope, [{
    key: __searchAncestor__,
    value: function (key) {
      if (this[__key__] === key) {
        return this;
      } else if (this[__parentScope__]) {
        return this[__parentScope__][__searchAncestor__](key);
      } else {
        return undefined;
      }
    }
  }, {
    key: "with",
    value: function _with(key, provider) {
      return new Scope(provider, key, this, this[__globalBindings__]);
    }
  }, {
    key: "constant",
    value: function constant(key, value) {
      return this["with"](key, function () {
        return value;
      });
    }
  }, {
    key: "bind",
    value: function bind(key, fn) {
      var newScope = this["with"](key, fn);
      if (this[__globalBindings__].has(key)) {
        throw new Error("Key" + key + " is already bound");
      }
      this[__globalBindings__].set(key, newScope);
      return this;
    }
  }, {
    key: "run",
    value: function run(fn) {
      var runScope = this["with"]("(run)", fn);
      return runScope.resolve("(run)");
    }
  }, {
    key: "resolve",
    value: function resolve(key) {
      var runScope = arguments[1] === undefined ? this : arguments[1];
      var runContext = arguments[2] === undefined ? new Map() : arguments[2];
      var searchChain = arguments[3] === undefined ? [] : arguments[3];

      // Check if the key is already in the search chain.
      if (searchChain.indexOf(key) >= 0) {
        throw new Error("Cyclic dependency:\n" + searchChain.join(" -> ") + " -> " + key);
      }

      var childSearchChain = searchChain.concat([key]);

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
            return scope.resolve(key, runScope, runContext, childSearchChain);
          };
          var require = function (key) {
            var value = optional(key);
            if (value === undefined) {
              throw new Error("Cannot find " + key + ":\n" + searchChain.join(" -> ") + " -> " + key);
            }
            return value;
          };

          runContext.set(scope, scope[__provider__](require, optional));
        })();
      }

      return runContext.get(scope);
    }
  }, {
    key: "toString",
    value: function toString() {
      var parentStrPart = this[__parentScope__] ? [this[__parentScope__].toString()] : [];
      return [this[__key__]].concat(parentStrPart).join(" -> ");
    }
  }, {
    key: "reset",
    value: function reset() {
      this[__globalBindings__].clear();
    }
  }]);

  return Scope;
})();

module.exports = Scope;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZ3NvZWQvcHJvai9kaS1qcy9zcmMvaW5kZXguanMiLCIvVXNlcnMvZ3NvZWQvcHJvai9kaS1qcy9zcmMvc2NvcGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0lDQU8sS0FBSywyQkFBTSxTQUFTOztBQUUzQixDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQ1gsUUFBTSxLQUFRLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUM3QixRQUFNLEtBQVEsTUFBUyxHQUFHLEtBQUssQ0FBQztDQUNqQyxDQUFBLENBQUUsTUFBTSxDQUFDLENBQUM7Ozs7Ozs7OztBQ0xYLElBQU0sa0JBQWtCLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDcEQsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlCLElBQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM5QyxJQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsSUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7SUFFOUMsS0FBSztBQUNFLFdBRFAsS0FBSyxHQUNvRjtRQUFqRixRQUFRLGdDQUFHLElBQUk7UUFBRSxHQUFHLGdDQUFHLFFBQVE7UUFBRSxXQUFXLGdDQUFHLElBQUk7UUFBRSxjQUFjLGdDQUFHLElBQUksR0FBRyxFQUFFOzswQkFEdkYsS0FBSzs7QUFFUCxRQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxjQUFjLENBQUM7QUFDMUMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNwQixRQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsV0FBVyxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxRQUFR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QUFJLE9BQU8sR0FBRyxVQUFBLEdBQUcsRUFBSTtBQUNuQixnQkFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLGdCQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7QUFDdkIsb0JBQU0sSUFBSSxLQUFLLGtCQUFnQixHQUFHLFdBQU0sV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBTyxHQUFHLENBQUcsQ0FBQzthQUMvRTtBQUNELG1CQUFPLEtBQUssQ0FBQztXQUNkLENBQUM7O0FBRUYsb0JBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQzs7T0FDL0Q7O0FBRUQsYUFBTyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzlCOzs7V0FFTyxvQkFBRztBQUNULFVBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNwRixhQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMzRDs7O1dBRUksaUJBQUc7QUFDTixVQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNsQzs7O1NBMUZHLEtBQUs7OztpQkE2RkksS0FBSyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgU2NvcGUgZnJvbSAnLi9zY29wZSc7XG5cbigod2luZG93KSA9PiB7XG4gIHdpbmRvd1snRElKUyddID0gbmV3IFNjb3BlKCk7XG4gIHdpbmRvd1snRElKUyddWydTY29wZSddID0gU2NvcGU7XG59KSh3aW5kb3cpO1xuIiwiY29uc3QgX19nbG9iYWxCaW5kaW5nc19fID0gU3ltYm9sKCdnbG9iYWxCaW5kaW5ncycpO1xuY29uc3QgX19rZXlfXyA9IFN5bWJvbCgna2V5Jyk7XG5jb25zdCBfX3BhcmVudFNjb3BlX18gPSBTeW1ib2woJ3BhcmVudFNjb3BlJyk7XG5jb25zdCBfX3Byb3ZpZGVyX18gPSBTeW1ib2woJ3Byb3ZpZGVyJyk7XG5jb25zdCBfX3NlYXJjaEFuY2VzdG9yX18gPSBTeW1ib2woJ3NlYXJjaEFuY2VzdG9yJyk7XG5cbmNsYXNzIFNjb3BlIHtcbiAgY29uc3RydWN0b3IocHJvdmlkZXIgPSBudWxsLCBrZXkgPSAnKHJvb3QpJywgcGFyZW50U2NvcGUgPSBudWxsLCBnbG9iYWxCaW5kaW5ncyA9IG5ldyBNYXAoKSkge1xuICAgIHRoaXNbX19nbG9iYWxCaW5kaW5nc19fXSA9IGdsb2JhbEJpbmRpbmdzO1xuICAgIHRoaXNbX19rZXlfX10gPSBrZXk7XG4gICAgdGhpc1tfX3BhcmVudFNjb3BlX19dID0gcGFyZW50U2NvcGU7XG4gICAgdGhpc1tfX3Byb3ZpZGVyX19dID0gcHJvdmlkZXI7XG4gIH1cblxuICBbX19zZWFyY2hBbmNlc3Rvcl9fXShrZXkpIHtcbiAgICBpZiAodGhpc1tfX2tleV9fXSA9PT0ga2V5KSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2UgaWYgKHRoaXNbX19wYXJlbnRTY29wZV9fXSl7XG4gICAgICByZXR1cm4gdGhpc1tfX3BhcmVudFNjb3BlX19dW19fc2VhcmNoQW5jZXN0b3JfX10oa2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICB3aXRoKGtleSwgcHJvdmlkZXIpIHtcbiAgICByZXR1cm4gbmV3IFNjb3BlKHByb3ZpZGVyLCBrZXksIHRoaXMsIHRoaXNbX19nbG9iYWxCaW5kaW5nc19fXSk7XG4gIH1cblxuICBjb25zdGFudChrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aChrZXksICgpID0+IHZhbHVlKTtcbiAgfVxuXG4gIGJpbmQoa2V5LCBmbikge1xuICAgIGxldCBuZXdTY29wZSA9IHRoaXMud2l0aChrZXksIGZuKTtcbiAgICBpZiAodGhpc1tfX2dsb2JhbEJpbmRpbmdzX19dLmhhcyhrZXkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0tleSAke2tleX0gaXMgYWxyZWFkeSBib3VuZCcpO1xuICAgIH1cbiAgICB0aGlzW19fZ2xvYmFsQmluZGluZ3NfX10uc2V0KGtleSwgbmV3U2NvcGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcnVuKGZuKSB7XG4gICAgbGV0IHJ1blNjb3BlID0gdGhpcy53aXRoKCcocnVuKScsIGZuKTtcbiAgICByZXR1cm4gcnVuU2NvcGUucmVzb2x2ZSgnKHJ1biknKTtcbiAgfVxuXG4gIHJlc29sdmUoa2V5LCBydW5TY29wZSA9IHRoaXMsIHJ1bkNvbnRleHQgPSBuZXcgTWFwKCksIHNlYXJjaENoYWluID0gW10pIHtcbiAgICAvLyBDaGVjayBpZiB0aGUga2V5IGlzIGFscmVhZHkgaW4gdGhlIHNlYXJjaCBjaGFpbi5cbiAgICBpZiAoc2VhcmNoQ2hhaW4uaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ3ljbGljIGRlcGVuZGVuY3k6XFxuJHtzZWFyY2hDaGFpbi5qb2luKCcgLT4gJyl9IC0+ICR7a2V5fWApO1xuICAgIH1cblxuICAgIGxldCBjaGlsZFNlYXJjaENoYWluID0gc2VhcmNoQ2hhaW4uY29uY2F0KFtrZXldKTtcblxuICAgIC8vIEZpcnN0LCBmaW5kIHRoZSBhbmNlc3RyYWwgc2NvcGUuXG4gICAgbGV0IHNjb3BlID0gdGhpc1tfX3NlYXJjaEFuY2VzdG9yX19dKGtleSk7XG5cbiAgICAvLyBTZWNvbmQsIGZpbmQgaW4gdGhlIHJ1bm5pbmcgc2NvcGUuXG4gICAgaWYgKHNjb3BlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHNjb3BlID0gcnVuU2NvcGVbX19zZWFyY2hBbmNlc3Rvcl9fXShrZXkpO1xuICAgIH1cblxuICAgIC8vIEZpbmFsbHksIHNlYXJjaCBpbiB0aGUgZ2xvYmFsIGJpbmRpbmdzLlxuICAgIGlmIChzY29wZSA9PT0gdW5kZWZpbmVkICYmIHRoaXNbX19nbG9iYWxCaW5kaW5nc19fXS5oYXMoa2V5KSkge1xuICAgICAgc2NvcGUgPSB0aGlzW19fZ2xvYmFsQmluZGluZ3NfX10uZ2V0KGtleSk7XG4gICAgfVxuXG4gICAgaWYgKHNjb3BlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKCFydW5Db250ZXh0LmhhcyhzY29wZSkpIHtcbiAgICAgIGxldCBvcHRpb25hbCA9IGtleSA9PiB7XG4gICAgICAgIHJldHVybiBzY29wZS5yZXNvbHZlKGtleSwgcnVuU2NvcGUsIHJ1bkNvbnRleHQsIGNoaWxkU2VhcmNoQ2hhaW4pO1xuICAgICAgfTtcbiAgICAgIGxldCByZXF1aXJlID0ga2V5ID0+IHtcbiAgICAgICAgbGV0IHZhbHVlID0gb3B0aW9uYWwoa2V5KTtcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBmaW5kICR7a2V5fTpcXG4ke3NlYXJjaENoYWluLmpvaW4oJyAtPiAnKX0gLT4gJHtrZXl9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfTtcblxuICAgICAgcnVuQ29udGV4dC5zZXQoc2NvcGUsIHNjb3BlW19fcHJvdmlkZXJfX10ocmVxdWlyZSwgb3B0aW9uYWwpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcnVuQ29udGV4dC5nZXQoc2NvcGUpO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IHBhcmVudFN0clBhcnQgPSB0aGlzW19fcGFyZW50U2NvcGVfX10gPyBbdGhpc1tfX3BhcmVudFNjb3BlX19dLnRvU3RyaW5nKCldIDogW107XG4gICAgcmV0dXJuIFt0aGlzW19fa2V5X19dXS5jb25jYXQocGFyZW50U3RyUGFydCkuam9pbignIC0+ICcpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpc1tfX2dsb2JhbEJpbmRpbmdzX19dLmNsZWFyKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NvcGU7XG4iXX0=
