var $__src_47_utils__ = (function() {
  "use strict";
  var __moduleName = "src/utils";
  var Utils = {
    extractTemplate: function(templateQuery, doc) {
      return this.activateTemplate(doc.querySelector(templateQuery), doc);
    },
    activateTemplate: function(template, doc) {
      return doc.importNode(template.content, true);
    },
    nonNullFn: function(scope, name) {
      return scope[$traceurRuntime.toProperty(name)] || ((function() {}));
    },
    observe: function(object, property, handler) {
      var newHandler = function(changes) {
        changes.forEach((function(change) {
          if (!property || change.name === property) {
            handler(change.name, change.type, change.oldValue);
          }
        }));
      };
      Object.observe(object, newHandler);
      return newHandler;
    },
    waitFor: function(object, property, condition) {
      var promise = new Promise((function(resolve, reject) {
        var truthFn = (typeof condition === 'function') ? condition : (function(v) {
          return v === condition;
        });
        if (truthFn(object[$traceurRuntime.toProperty(property)])) {
          resolve(object, property);
        } else {
          var observer = (function(changes) {
            if (truthFn(object[$traceurRuntime.toProperty(property)])) {
              Object.unobserve(object, observer);
              resolve(object, property);
            }
          });
          Object.observe(object, observer);
        }
      }));
      return promise;
    },
    compare: function(a, b) {
      if (typeof a === 'number' && typeof b === 'number') {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        } else {
          return 0;
        }
      }
      return undefined;
    },
    toArray: function(obj) {
      var array = [];
      for (var i = 0; i < obj.length; i++) {
        array[$traceurRuntime.toProperty(i)] = obj[$traceurRuntime.toProperty(i)];
      }
      return array;
    },
    makeGlobal: function(namespace, target) {
      var currentScope = window;
      var pathArr = namespace.split('.');
      pathArr.forEach((function(path, i) {
        if (i === (pathArr.length - 1)) {
          if (!currentScope[$traceurRuntime.toProperty(path)]) {
            currentScope[$traceurRuntime.toProperty(path)] = target;
          } else {
            throw (namespace + " already exists");
          }
        } else {
          if (!currentScope[$traceurRuntime.toProperty(path)]) {
            currentScope[$traceurRuntime.toProperty(path)] = {};
          }
        }
        currentScope = currentScope[$traceurRuntime.toProperty(path)];
      }));
    },
    extendFn: function(scope, name, fn, callBefore) {
      var oldFn = scope[$traceurRuntime.toProperty(name)];
      scope[$traceurRuntime.toProperty(name)] = function() {
        if (callBefore) {
          var rv = fn.apply(this, arguments);
          if (!oldFn) {
            return rv;
          }
        }
        if (oldFn) {
          var rv$__0 = oldFn.apply(this, arguments);
          if (callBefore) {
            return rv$__0;
          }
        }
        if (!callBefore) {
          return fn.apply(this, arguments);
        }
      };
    },
    curry: function(fn) {
      return function() {
        if (arguments.length >= fn.length) {
          return fn.apply(this, arguments);
        } else {
          var argArray = Utils.toArray(arguments);
          return Utils.curry(fn.bind.apply(fn, [this].concat(argArray)));
        }
      };
    },
    getSymbol: function(obj, name) {
      return Object.getOwnPropertySymbols(obj).find((function(symbol) {
        return ("Symbol(" + name + ")") === symbol.toString();
      }));
    }
  };
  var $__default = Utils = Utils;
  Utils.makeGlobal('pb.Utils', Utils);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_ability_47_ability__ = (function() {
  "use strict";
  var __moduleName = "src/ability/ability";
  var Utils = ($__src_47_utils__).default;
  var Ability = function Ability() {};
  ($traceurRuntime.createClass)(Ability, {
    setDefaultValue: function(el) {},
    attributeChangedCallback: function(el, name, oldValue, newValue) {},
    attachedCallback: function(el) {},
    detachedCallback: function(el) {},
    trigger: function(el) {},
    get name() {
      throw 'unimplemented';
    }
  }, {});
  var $__default = Ability;
  if (window[$traceurRuntime.toProperty('TEST_MODE')]) {
    Utils.makeGlobal('pb.ability.Ability', Ability);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_hammerwrapper__ = (function() {
  "use strict";
  var $__1;
  var __moduleName = "src/hammerwrapper";
  var Utils = ($__src_47_utils__).default;
  var __hammer__ = Symbol();
  var __getHammer__ = Symbol();
  var HammerWrapper = ($__1 = {}, Object.defineProperty($__1, __getHammer__, {
    value: function(el) {
      if (!el[$traceurRuntime.toProperty(__hammer__)]) {
        if (!el.ownerDocument.parentWindow) {
          el.ownerDocument.parentWindow = window;
        }
        var hammer = new Hammer.Manager(el);
        hammer.add(new Hammer.Tap({
          event: 'doubletap',
          taps: 2,
          interval: 250
        }));
        hammer.add(new Hammer.Tap({
          event: 'singletap',
          taps: 1,
          interval: 250
        }));
        hammer.get('doubletap').recognizeWith('singletap');
        hammer.get('singletap').requireFailure('doubletap');
        el[$traceurRuntime.toProperty(__hammer__)] = hammer;
      }
      return el[$traceurRuntime.toProperty(__hammer__)];
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__1, "on", {
    value: function(el, gestureType, handler) {
      this[$traceurRuntime.toProperty(__getHammer__)](el).on(gestureType, handler);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__1, "off", {
    value: function(el, eventType, handler) {
      this[$traceurRuntime.toProperty(__getHammer__)](el).on(eventType, handler);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__1);
  var $__default = HammerWrapper = HammerWrapper;
  if (window[$traceurRuntime.toProperty('TEST_MODE')]) {
    Utils.makeGlobal('pb.HammerWrapper', HammerWrapper);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_ability_47_triggerable__ = (function() {
  "use strict";
  var $__4;
  var __moduleName = "src/ability/triggerable";
  var HammerWrapper = ($__src_47_hammerwrapper__).default;
  var Utils = ($__src_47_utils__).default;
  var Ability = ($__src_47_ability_47_ability__).default;
  var __defaultValue__ = Symbol();
  var __knownAbilities__ = Symbol();
  var __triggers__ = Symbol();
  var __getEvent__ = Symbol('getEvent');
  var __getTriggers__ = Symbol('getTriggers');
  var __isRegistered__ = Symbol('isRegistered');
  var __register__ = Symbol('register');
  var __unregister__ = Symbol('unregister');
  var Triggerable = function Triggerable() {
    var defaultValue = arguments[0] !== (void 0) ? arguments[0] : {};
    var knownAbilities = arguments[1] !== (void 0) ? arguments[1] : [];
    this[$traceurRuntime.toProperty(__defaultValue__)] = defaultValue;
    this[$traceurRuntime.toProperty(__knownAbilities__)] = {};
    for (var $__5 = knownAbilities[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__6; !($__6 = $__5.next()).done; ) {
      var ability = $__6.value;
      {
        this[$traceurRuntime.toProperty(__knownAbilities__)][$traceurRuntime.toProperty(ability.name)] = ability;
      }
    }
  };
  var $Triggerable = Triggerable;
  ($traceurRuntime.createClass)(Triggerable, ($__4 = {}, Object.defineProperty($__4, __getEvent__, {
    value: function(triggerType) {
      switch (triggerType) {
        case $Triggerable.TYPES.CLICK:
          return 'singletap';
        case $Triggerable.TYPES.DOUBLE_CLICK:
          return 'doubletap';
        default:
          throw 'Unrecognized trigger: ' + triggerType;
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, __getTriggers__, {
    value: function(el) {
      if (!el[$traceurRuntime.toProperty(__triggers__)]) {
        el[$traceurRuntime.toProperty(__triggers__)] = {};
      }
      return el[$traceurRuntime.toProperty(__triggers__)];
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, __isRegistered__, {
    value: function(el, triggerType, abilityName) {
      if (!this[$traceurRuntime.toProperty(__getTriggers__)](el)[$traceurRuntime.toProperty(triggerType)]) {
        return false;
      }
      var ability = this[$traceurRuntime.toProperty(__getTriggers__)](el)[$traceurRuntime.toProperty(triggerType)].ability;
      return ability && abilityName === ability.name;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, __register__, {
    value: function(el, triggerType, ability) {
      if (!this[$traceurRuntime.toProperty(__isRegistered__)](el, triggerType, ability.name)) {
        var handlers = this[$traceurRuntime.toProperty(__getTriggers__)](el);
        handlers[$traceurRuntime.toProperty(triggerType)] = {
          ability: ability,
          handler: ability.trigger.bind(ability, el)
        };
        HammerWrapper.on(el, this[$traceurRuntime.toProperty(__getEvent__)](triggerType), handlers[$traceurRuntime.toProperty(triggerType)].handler);
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, __unregister__, {
    value: function(el, triggerType) {
      var handlers = this[$traceurRuntime.toProperty(__getTriggers__)](el);
      if (handlers[$traceurRuntime.toProperty(triggerType)]) {
        HammerWrapper.off(el, this[$traceurRuntime.toProperty(__getEvent__)](triggerType), handlers[$traceurRuntime.toProperty(triggerType)].handler);
        delete handlers[$traceurRuntime.toProperty(triggerType)];
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "setDefaultValue", {
    value: function(el) {
      for (var key in $Triggerable.TYPES)
        if (!$traceurRuntime.isSymbolString(key)) {
          var type = $Triggerable.TYPES[$traceurRuntime.toProperty(key)];
          var abilityName = this[$traceurRuntime.toProperty(__defaultValue__)][$traceurRuntime.toProperty(type)];
          if ($(el).attr(type) === undefined && abilityName && this[$traceurRuntime.toProperty(__knownAbilities__)][$traceurRuntime.toProperty(abilityName)]) {
            $(el).attr(type, abilityName);
          }
        }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "attributeChangedCallback", {
    value: function(el, name, oldValue, newValue) {
      for (var key in $Triggerable.TYPES)
        if (!$traceurRuntime.isSymbolString(key)) {
          if (name === $Triggerable.TYPES[$traceurRuntime.toProperty(key)]) {
            if (oldValue && this[$traceurRuntime.toProperty(__knownAbilities__)][$traceurRuntime.toProperty(oldValue)]) {
              this[$traceurRuntime.toProperty(__unregister__)](el, name, this[$traceurRuntime.toProperty(__knownAbilities__)][$traceurRuntime.toProperty(oldValue)]);
            }
            if (newValue && this[$traceurRuntime.toProperty(__knownAbilities__)][$traceurRuntime.toProperty(newValue)]) {
              this[$traceurRuntime.toProperty(__register__)](el, name, this[$traceurRuntime.toProperty(__knownAbilities__)][$traceurRuntime.toProperty(newValue)]);
            }
          }
        }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "attachedCallback", {
    value: function(el) {
      for (var key in $Triggerable.TYPES)
        if (!$traceurRuntime.isSymbolString(key)) {
          var triggerType = $Triggerable.TYPES[$traceurRuntime.toProperty(key)];
          var abilityName = $(el).attr(triggerType);
          if (abilityName && this[$traceurRuntime.toProperty(__knownAbilities__)][$traceurRuntime.toProperty(abilityName)]) {
            this[$traceurRuntime.toProperty(__register__)](el, triggerType, this[$traceurRuntime.toProperty(__knownAbilities__)][$traceurRuntime.toProperty(abilityName)]);
          }
        }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "detachedCallback", {
    value: function(el) {
      for (var key in $Triggerable.TYPES)
        if (!$traceurRuntime.isSymbolString(key)) {
          this[$traceurRuntime.toProperty(__unregister__)](el, $Triggerable.TYPES[$traceurRuntime.toProperty(key)]);
        }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "name", {
    get: function() {
      return 'pb-triggerable';
    },
    configurable: true,
    enumerable: true
  }), $__4), {}, Ability);
  Triggerable.TYPES = {
    CLICK: 'pb-click',
    DOUBLE_CLICK: 'pb-dblclick'
  };
  var $__default = Triggerable = Triggerable;
  if (window[$traceurRuntime.toProperty('TEST_MODE')]) {
    Utils.makeGlobal('pb.ability.Triggerable', Triggerable);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_ability_47_abilities__ = (function() {
  "use strict";
  var $__2;
  var __moduleName = "src/ability/abilities";
  var Triggerable = ($__src_47_ability_47_triggerable__).default;
  var Utils = ($__src_47_utils__).default;
  var __register__ = Symbol();
  var __abilities__ = Symbol();
  var Abilities = ($__2 = {}, Object.defineProperty($__2, __register__, {
    value: function(ctorProto, ability) {
      Utils.extendFn(ctorProto, 'createdCallback', function() {
        if (!this[$traceurRuntime.toProperty(__abilities__)]) {
          this[$traceurRuntime.toProperty(__abilities__)] = {};
        }
        this[$traceurRuntime.toProperty(__abilities__)][$traceurRuntime.toProperty(ability.name)] = ability;
        ability.setDefaultValue.call(ability, this);
      });
      Utils.extendFn(ctorProto, 'attributeChangedCallback', function(name, oldValue, newValue) {
        ability.attributeChangedCallback.call(ability, this, name, oldValue, newValue);
      });
      Utils.extendFn(ctorProto, 'attachedCallback', function() {
        ability.attachedCallback.call(ability, this);
      });
      Utils.extendFn(ctorProto, 'detachedCallback', function() {
        ability.detachedCallback.call(ability, this);
      }, true);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "config", {
    value: function(ctor, cfg) {
      for (var abilities = [],
          $__5 = 2; $__5 < arguments.length; $__5++)
        abilities[$traceurRuntime.toProperty($__5 - 2)] = arguments[$traceurRuntime.toProperty($__5)];
      var ctorProto = ctor.prototype;
      var triggerConfig = {};
      var knownAbilities = new Set();
      for (var key in cfg)
        if (!$traceurRuntime.isSymbolString(key)) {
          var ability = cfg[$traceurRuntime.toProperty(key)];
          knownAbilities.add(ability);
          this[$traceurRuntime.toProperty(__register__)](ctorProto, ability);
          triggerConfig[$traceurRuntime.toProperty(key)] = ability.name;
        }
      for (var $__3 = abilities[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__4; !($__4 = $__3.next()).done; ) {
        var ability$__6 = $__4.value;
        {
          knownAbilities.add(ability$__6);
          this[$traceurRuntime.toProperty(__register__)](ctorProto, ability$__6);
        }
      }
      this[$traceurRuntime.toProperty(__register__)](ctorProto, new Triggerable(triggerConfig, knownAbilities));
      return ctor;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__2);
  var $__default = Abilities;
  if (window[$traceurRuntime.toProperty('TEST_MODE')]) {
    Utils.makeGlobal('pb.ability.Abilities', Abilities);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_check__ = (function() {
  "use strict";
  var $__2;
  var __moduleName = "src/check";
  var Utils = ($__src_47_utils__).default;
  var __addChecked__ = Symbol();
  var __checked__ = Symbol();
  var __input__ = Symbol();
  var __value__ = Symbol();
  var Continuation = function Continuation(input) {
    var value = arguments[1];
    var checked = arguments[2] !== (void 0) ? arguments[2] : [];
    this[$traceurRuntime.toProperty(__checked__)] = checked;
    this[$traceurRuntime.toProperty(__input__)] = input;
    this[$traceurRuntime.toProperty(__value__)] = value;
  };
  var $Continuation = Continuation;
  ($traceurRuntime.createClass)(Continuation, ($__2 = {}, Object.defineProperty($__2, __addChecked__, {
    value: function(checked) {
      return new $Continuation(this[$traceurRuntime.toProperty(__input__)], this[$traceurRuntime.toProperty(__value__)], this[$traceurRuntime.toProperty(__checked__)].concat(checked));
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "isInt", {
    value: function() {
      var radix = arguments[0] !== (void 0) ? arguments[0] : 10;
      var output = Number.parseInt(this[$traceurRuntime.toProperty(__input__)], radix);
      if (Number.isNaN(output)) {
        return this[$traceurRuntime.toProperty(__addChecked__)](("int(radix = " + radix + ")"));
      }
      return new $Continuation(this[$traceurRuntime.toProperty(__input__)], output);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "isBoolean", {
    value: function() {
      return new $Continuation(this[$traceurRuntime.toProperty(__input__)], this[$traceurRuntime.toProperty(__input__)].toLowerCase() === 'true');
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "orThrows", {
    value: function(msg) {
      if (this[$traceurRuntime.toProperty(__value__)] === undefined) {
        if (!msg) {
          msg = ("Illegal Exception. Checked: " + this[$traceurRuntime.toProperty(__checked__)].join(', ') + " ") + ("but was " + this[$traceurRuntime.toProperty(__input__)]);
        }
        throw msg;
      } else {
        return this[$traceurRuntime.toProperty(__value__)];
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "orUse", {
    value: function(backup) {
      return (this[$traceurRuntime.toProperty(__value__)] === undefined) ? backup : this[$traceurRuntime.toProperty(__value__)];
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__2), {});
  function check(input) {
    return new Continuation(input);
  }
  var $__default = check;
  Utils.makeGlobal('pb.Check', check);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_events__ = (function() {
  "use strict";
  var $__3,
      $__4;
  var __moduleName = "src/events";
  var Utils = ($__src_47_utils__).default;
  var TYPES = {
    DOM: 'dom',
    JQUERY: 'jquery'
  };
  var HANDLERS = ($__3 = {}, Object.defineProperty($__3, TYPES.DOM, {
    value: {
      register: function(action, eventName, handler) {
        action[$traceurRuntime.toProperty(__element__)].addEventListener(eventName, handler);
      },
      unregister: function(action, eventName, handler) {
        action[$traceurRuntime.toProperty(__element__)].removeEventListener(eventName, handler);
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, TYPES.JQUERY, {
    value: {
      register: function(action, eventName, handler) {
        $(action[$traceurRuntime.toProperty(__element__)]).on(eventName, handler);
      },
      unregister: function(action, eventName, handler) {
        $(action[$traceurRuntime.toProperty(__element__)]).off(eventName, handler);
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__3);
  var __element__ = Symbol();
  var __scope__ = Symbol();
  var __isRegistered__ = Symbol('isRegistered');
  var __register__ = Symbol('register');
  var __unregister__ = Symbol('unregister');
  var Action = function Action(element, scope) {
    this[$traceurRuntime.toProperty(__element__)] = element;
    if (!this[$traceurRuntime.toProperty(__element__)][$traceurRuntime.toProperty(__scope__)]) {
      this[$traceurRuntime.toProperty(__element__)][$traceurRuntime.toProperty(__scope__)] = {};
    }
  };
  ($traceurRuntime.createClass)(Action, ($__4 = {}, Object.defineProperty($__4, __isRegistered__, {
    value: function(type, eventName, handler) {
      if (!this[$traceurRuntime.toProperty(__element__)][$traceurRuntime.toProperty(__scope__)][$traceurRuntime.toProperty(type)]) {
        return false;
      }
      var eventSet = this[$traceurRuntime.toProperty(__element__)][$traceurRuntime.toProperty(__scope__)][$traceurRuntime.toProperty(type)][$traceurRuntime.toProperty(eventName)];
      if (handler) {
        return !!eventSet && eventSet.has(handler);
      } else {
        return !!eventSet && eventSet.size > 0;
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, __register__, {
    value: function(type, eventName, handler) {
      if (this[$traceurRuntime.toProperty(__isRegistered__)](type, eventName, handler)) {
        return this;
      }
      HANDLERS[$traceurRuntime.toProperty(type)].register(this, eventName, handler);
      if (!this[$traceurRuntime.toProperty(__element__)][$traceurRuntime.toProperty(__scope__)][$traceurRuntime.toProperty(type)]) {
        this[$traceurRuntime.toProperty(__element__)][$traceurRuntime.toProperty(__scope__)][$traceurRuntime.toProperty(type)] = {};
      }
      if (!this[$traceurRuntime.toProperty(__element__)][$traceurRuntime.toProperty(__scope__)][$traceurRuntime.toProperty(type)][$traceurRuntime.toProperty(eventName)]) {
        this[$traceurRuntime.toProperty(__element__)][$traceurRuntime.toProperty(__scope__)][$traceurRuntime.toProperty(type)][$traceurRuntime.toProperty(eventName)] = new Set();
      }
      this[$traceurRuntime.toProperty(__element__)][$traceurRuntime.toProperty(__scope__)][$traceurRuntime.toProperty(type)][$traceurRuntime.toProperty(eventName)].add(handler);
      return this;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, __unregister__, {
    value: function(type, eventName, handler) {
      var $__1 = this;
      if (!type) {
        for (var registeredType in this[$traceurRuntime.toProperty(__element__)][$traceurRuntime.toProperty(__scope__)])
          if (!$traceurRuntime.isSymbolString(registeredType)) {
            this[$traceurRuntime.toProperty(__unregister__)](registeredType);
          }
        return this;
      }
      if (!eventName) {
        for (var event in this[$traceurRuntime.toProperty(__element__)][$traceurRuntime.toProperty(__scope__)][$traceurRuntime.toProperty(type)])
          if (!$traceurRuntime.isSymbolString(event)) {
            this[$traceurRuntime.toProperty(__unregister__)](type, event);
          }
        return this;
      }
      var eventSet = this[$traceurRuntime.toProperty(__element__)][$traceurRuntime.toProperty(__scope__)][$traceurRuntime.toProperty(type)][$traceurRuntime.toProperty(eventName)];
      if (!eventSet) {
        return this;
      }
      if (!handler) {
        eventSet.forEach((function(registeredHandler) {
          return $__1[$traceurRuntime.toProperty(__unregister__)](type, eventName, registeredHandler);
        }));
      } else {
        HANDLERS[$traceurRuntime.toProperty(type)].unregister(this, eventName, handler);
        eventSet.delete(handler);
      }
      return this;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "listen", {
    value: function(eventName, handler) {
      return this[$traceurRuntime.toProperty(__register__)](TYPES.DOM, eventName, handler);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "unlisten", {
    value: function(eventName, handler) {
      return this[$traceurRuntime.toProperty(__unregister__)](TYPES.DOM, eventName, handler);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "hasListener", {
    value: function(eventName, handler) {
      return this[$traceurRuntime.toProperty(__isRegistered__)](TYPES.DOM, eventName, handler);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "on", {
    value: function(eventName, handler) {
      return this[$traceurRuntime.toProperty(__register__)](TYPES.JQUERY, eventName, handler);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "off", {
    value: function(eventName, handler) {
      return this[$traceurRuntime.toProperty(__unregister__)](TYPES.JQUERY, eventName, handler);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__4), {});
  var Events = {of: function(element, scope) {
      return new Action(element, scope);
    }};
  var $__default = Events = Events;
  if (window[$traceurRuntime.toProperty('TEST_MODE')]) {
    Utils.makeGlobal('pb.Events', Events);
    Utils.makeGlobal('pb.Events.Action', Action);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_service_47_dragdrop__ = (function() {
  "use strict";
  var $__1;
  var __moduleName = "src/service/dragdrop";
  var Utils = ($__src_47_utils__).default;
  var __lastDraggedEl__ = Symbol();
  var __offsetX__ = Symbol();
  var __offsetY__ = Symbol();
  var DragDrop = ($__1 = {}, Object.defineProperty($__1, __lastDraggedEl__, {
    value: null,
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__1, "dragStart", {
    value: function(draggedEl, offsetX, offsetY) {
      this[$traceurRuntime.toProperty(__lastDraggedEl__)] = draggedEl;
      this[$traceurRuntime.toProperty(__offsetX__)] = offsetX;
      this[$traceurRuntime.toProperty(__offsetY__)] = offsetY;
      $(this).trigger(DragDrop.Events.LAST_DRAGGED_EL_CHANGED);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__1, "dragEnd", {
    value: function() {
      this[$traceurRuntime.toProperty(__lastDraggedEl__)] = null;
      this[$traceurRuntime.toProperty(__offsetX__)] = undefined;
      this[$traceurRuntime.toProperty(__offsetY__)] = undefined;
      $(this).trigger(DragDrop.Events.LAST_DRAGGED_EL_CHANGED);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__1, "lastDraggedEl", {
    get: function() {
      return this[$traceurRuntime.toProperty(__lastDraggedEl__)];
    },
    configurable: true,
    enumerable: true
  }), Object.defineProperty($__1, "offsetX", {
    get: function() {
      return this[$traceurRuntime.toProperty(__offsetX__)];
    },
    configurable: true,
    enumerable: true
  }), Object.defineProperty($__1, "offsetY", {
    get: function() {
      return this[$traceurRuntime.toProperty(__offsetY__)];
    },
    configurable: true,
    enumerable: true
  }), $__1);
  DragDrop.Events = {LAST_DRAGGED_EL_CHANGED: 'dragdrop-last_dragged_el_changed'};
  var $__default = DragDrop = DragDrop;
  Utils.makeGlobal('pb.service.DragDrop', DragDrop);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_ability_47_draggable__ = (function() {
  "use strict";
  var $__7;
  var __moduleName = "src/ability/draggable";
  var Check = ($__src_47_check__).default;
  var Events = ($__src_47_events__).default;
  var Utils = ($__src_47_utils__).default;
  var Ability = ($__src_47_ability_47_ability__).default;
  var DragDropService = ($__src_47_service_47_dragdrop__).default;
  var ATTR_NAME = 'pb-draggable';
  var CLASS_DRAGGED = 'pb-dragged';
  var __defaultValue__ = Symbol();
  var __onDragEnd__ = Symbol();
  var __onDragStart__ = Symbol('onDragStart');
  var __register__ = Symbol();
  var __unregister__ = Symbol();
  var Draggable = function Draggable(defaultValue) {
    this[$traceurRuntime.toProperty(__defaultValue__)] = defaultValue;
  };
  ($traceurRuntime.createClass)(Draggable, ($__7 = {}, Object.defineProperty($__7, __onDragEnd__, {
    value: function(el) {
      el.classList.remove(CLASS_DRAGGED);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__7, __onDragStart__, {
    value: function(el, event) {
      var dataTransfer = event.dataTransfer;
      dataTransfer.effectAllowed = 'move';
      el.classList.add(CLASS_DRAGGED);
      var boundingRect = el.getBoundingClientRect();
      DragDropService.dragStart(this.getMovedElement(el), event.clientX - boundingRect.left, event.clientY - boundingRect.top);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__7, __register__, {
    value: function(element) {
      var $__5 = this;
      Utils.toArray(element.children).forEach((function(child) {
        $(child).attr('draggable', 'true');
        Events.of(child, $__5).listen('dragstart', $__5[$traceurRuntime.toProperty(__onDragStart__)].bind($__5, element)).listen('dragend', $__5[$traceurRuntime.toProperty(__onDragEnd__)].bind($__5, element));
      }));
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__7, __unregister__, {
    value: function(element) {
      var $__5 = this;
      Utils.toArray(element.children).forEach((function(child) {
        Events.of(child, $__5).unlisten();
        $(child).attr('draggable', null);
      }));
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__7, "setDefaultValue", {
    value: function(el) {
      if ($(el).attr(ATTR_NAME) === undefined) {
        $(el).attr(ATTR_NAME, this[$traceurRuntime.toProperty(__defaultValue__)]);
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__7, "attributeChangedCallback", {
    value: function(el, name, oldValue, newValue) {
      if (name === ATTR_NAME) {
        newValue = Check(newValue).isBoolean(newValue).orThrows();
        if (newValue) {
          this[$traceurRuntime.toProperty(__register__)](el);
        } else {
          this[$traceurRuntime.toProperty(__unregister__)](el);
        }
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__7, "attachedCallback", {
    value: function(el) {
      if ($(el).attr(ATTR_NAME) && Check($(el).attr(ATTR_NAME)).isBoolean().orThrows()) {
        this[$traceurRuntime.toProperty(__register__)](el);
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__7, "detachedCallback", {
    value: function(el) {
      this[$traceurRuntime.toProperty(__unregister__)](el);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__7, "getMovedElement", {
    value: function(el) {
      return el;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__7, "name", {
    get: function() {
      return ATTR_NAME;
    },
    configurable: true,
    enumerable: true
  }), $__7), {}, Ability);
  var $__default = Draggable;
  if (window[$traceurRuntime.toProperty('TEST_MODE')]) {
    Utils.makeGlobal('pb.ability.Draggable', Draggable);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_ability_47_rotateable__ = (function() {
  "use strict";
  var $__4;
  var __moduleName = "src/ability/rotateable";
  var Check = ($__src_47_check__).default;
  var Utils = ($__src_47_utils__).default;
  var Ability = ($__src_47_ability_47_ability__).default;
  var ATTR_NAME = 'pb-rotateable';
  var ATTR_INDEX = 'pb-orientation-index';
  var __defaultIndex__ = Symbol();
  var __defaultOrientations__ = Symbol();
  var __getOrientations__ = Symbol();
  var __getOrientationIndex__ = Symbol();
  var __setOrientationIndex__ = Symbol('setOrientationIndex');
  var Rotateable = function Rotateable() {
    var defaultOrientations = arguments[0] !== (void 0) ? arguments[0] : [0];
    var defaultIndex = arguments[1] !== (void 0) ? arguments[1] : 0;
    this[$traceurRuntime.toProperty(__defaultIndex__)] = defaultIndex;
    this[$traceurRuntime.toProperty(__defaultOrientations__)] = defaultOrientations.join(' ');
  };
  ($traceurRuntime.createClass)(Rotateable, ($__4 = {}, Object.defineProperty($__4, __getOrientations__, {
    value: function(el) {
      return $(el).attr(ATTR_NAME).split(' ').map((function(str) {
        return Check(str).isInt().orUse(undefined);
      })).filter((function(value) {
        return Number.isInteger(value);
      }));
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, __getOrientationIndex__, {
    value: function(el) {
      return Check($(el).attr(ATTR_INDEX)).isInt().orThrows();
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, __setOrientationIndex__, {
    value: function(el, index) {
      var orientations = this[$traceurRuntime.toProperty(__getOrientations__)](el);
      if (orientations.length > 0) {
        if (index < 0) {
          index = -(-index % orientations.length);
          index += orientations.length;
        }
        if (index >= orientations.length) {
          index %= orientations.length;
        }
        $(el).attr(ATTR_INDEX, index);
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "setDefaultValue", {
    value: function(el) {
      if ($(el).attr(ATTR_NAME) === undefined || $(el).attr(ATTR_NAME) === 'true') {
        $(el).attr(ATTR_NAME, this[$traceurRuntime.toProperty(__defaultOrientations__)]);
      }
      if ($(el).attr(ATTR_INDEX) === undefined) {
        $(el).attr(ATTR_INDEX, this[$traceurRuntime.toProperty(__defaultIndex__)]);
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "attributeChangedCallback", {
    value: function(el, name, oldValue, newValue) {
      if (name === ATTR_NAME) {
        this[$traceurRuntime.toProperty(__setOrientationIndex__)](el, this[$traceurRuntime.toProperty(__getOrientationIndex__)](el));
      }
      if (name === ATTR_INDEX) {
        var orientation = this[$traceurRuntime.toProperty(__getOrientations__)](el)[$traceurRuntime.toProperty(Check(newValue).isInt().orThrows())];
        el.style.transform = ("rotateZ(" + orientation + "deg)");
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "trigger", {
    value: function(el) {
      this[$traceurRuntime.toProperty(__setOrientationIndex__)](el, this[$traceurRuntime.toProperty(__getOrientationIndex__)](el) + 1);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "name", {
    get: function() {
      return ATTR_NAME;
    },
    configurable: true,
    enumerable: true
  }), $__4), {}, Ability);
  var $__default = Rotateable;
  if (window[$traceurRuntime.toProperty('TEST_MODE')]) {
    Utils.makeGlobal('pb.ability.Rotateable', Rotateable);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_ability_47_toggleable__ = (function() {
  "use strict";
  var $__4;
  var __moduleName = "src/ability/toggleable";
  var Check = ($__src_47_check__).default;
  var Utils = ($__src_47_utils__).default;
  var Ability = ($__src_47_ability_47_ability__).default;
  var ATTR_NAME = 'pb-toggleable';
  var ATTR_SHOWFRONT = 'pb-showfront';
  var __defaultEnabled__ = Symbol();
  var __defaultShowFront__ = Symbol();
  var __isEnabled__ = Symbol();
  var __isShowFront__ = Symbol();
  var Toggleable = function Toggleable() {
    var defaultEnabled = arguments[0] !== (void 0) ? arguments[0] : true;
    var defaultShowFront = arguments[1] !== (void 0) ? arguments[1] : false;
    this[$traceurRuntime.toProperty(__defaultEnabled__)] = defaultEnabled;
    this[$traceurRuntime.toProperty(__defaultShowFront__)] = defaultShowFront;
  };
  ($traceurRuntime.createClass)(Toggleable, ($__4 = {}, Object.defineProperty($__4, __isEnabled__, {
    value: function(el) {
      return Check($(el).attr(ATTR_NAME)).isBoolean().orThrows();
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, __isShowFront__, {
    value: function(el) {
      return Check($(el).attr(ATTR_SHOWFRONT)).isBoolean().orThrows();
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "setDefaultValue", {
    value: function(el) {
      if ($(el).attr(ATTR_NAME) === undefined) {
        $(el).attr(ATTR_NAME, this[$traceurRuntime.toProperty(__defaultEnabled__)]);
      }
      if ($(el).attr(ATTR_SHOWFRONT) === undefined) {
        $(el).attr(ATTR_SHOWFRONT, this[$traceurRuntime.toProperty(__defaultShowFront__)]);
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "trigger", {
    value: function(el) {
      if (this[$traceurRuntime.toProperty(__isEnabled__)](el)) {
        $(el).attr(ATTR_SHOWFRONT, !this[$traceurRuntime.toProperty(__isShowFront__)](el));
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, "name", {
    get: function() {
      return ATTR_NAME;
    },
    configurable: true,
    enumerable: true
  }), $__4), {}, Ability);
  var $__default = Toggleable;
  if (window[$traceurRuntime.toProperty('TEST_MODE')]) {
    Utils.makeGlobal('pb.ability.Toggleable', Toggleable);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_ability_47_modules__ = (function() {
  "use strict";
  var __moduleName = "src/ability/modules";
  $__src_47_ability_47_abilities__;
  $__src_47_ability_47_draggable__;
  $__src_47_ability_47_rotateable__;
  $__src_47_ability_47_toggleable__;
  $__src_47_ability_47_triggerable__;
  return {};
})();
var $__src_47_ability_47_contextable__ = (function() {
  "use strict";
  var $__3;
  var __moduleName = "src/ability/contextable";
  var Utils = ($__src_47_utils__).default;
  var Ability = ($__src_47_ability_47_ability__).default;
  var __abilities__ = Symbol();
  var __menuEl__ = Symbol('menuEl');
  var __createMenuEl__ = Symbol();
  var __currentEl__ = Symbol('currentEl');
  var __onHide__ = Symbol();
  var __onShow__ = Symbol();
  var __trigger__ = Symbol();
  var Contextable = function Contextable(config) {
    this[$traceurRuntime.toProperty(__menuEl__)] = this[$traceurRuntime.toProperty(__createMenuEl__)](config);
    this[$traceurRuntime.toProperty(__currentEl__)] = null;
  };
  ($traceurRuntime.createClass)(Contextable, ($__3 = {}, Object.defineProperty($__3, __createMenuEl__, {
    value: function(config) {
      var menuEl = document.createElement('menu');
      $(menuEl).attr('type', 'context');
      for (var label in config)
        if (!$traceurRuntime.isSymbolString(label)) {
          var value = config[$traceurRuntime.toProperty(label)];
          var child = null;
          if (value instanceof Ability) {
            child = document.createElement('menuitem');
            $(child).attr('label', label);
            child.addEventListener('click', this[$traceurRuntime.toProperty(__trigger__)].bind(this, value));
          } else if (value === undefined) {
            child = document.createElement('hr');
          } else if (value instanceof Object) {
            child = this[$traceurRuntime.toProperty(__createMenuEl__)](value);
            $(child).attr('label', label);
          } else {
            throw ("Item with label " + label + " is invalid");
          }
          menuEl.appendChild(child);
        }
      return menuEl;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, __trigger__, {
    value: function(ability) {
      ability.trigger(this[$traceurRuntime.toProperty(__currentEl__)]);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, __onShow__, {
    value: function(config) {
      this[$traceurRuntime.toProperty(__currentEl__)] = config[$traceurRuntime.toProperty('pb-el')];
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, __onHide__, {
    value: function() {
      this[$traceurRuntime.toProperty(__currentEl__)] = null;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, "setDefaultValue", {
    value: function(el) {
      var tmpId = Math.random();
      $(el).attr('pb-id', tmpId);
      $.contextMenu({
        className: 'pb-contextable',
        selector: ("[pb-id=\"" + tmpId + "\"]"),
        items: $.contextMenu.fromMenu(this[$traceurRuntime.toProperty(__menuEl__)]),
        events: {
          show: this[$traceurRuntime.toProperty(__onShow__)].bind(this),
          hide: this[$traceurRuntime.toProperty(__onHide__)].bind(this)
        },
        'pb-el': el
      });
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, "name", {
    get: function() {
      return 'pb-contextable';
    },
    configurable: true,
    enumerable: true
  }), $__3), {}, Ability);
  var $__default = Contextable;
  if (window[$traceurRuntime.toProperty('TEST_MODE')]) {
    Utils.makeGlobal('pb.ability.Contextable', Contextable);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_pbelement__ = (function() {
  "use strict";
  var __moduleName = "src/pbelement";
  var Utils = ($__src_47_utils__).default;
  var PbElement = function PbElement() {
    $traceurRuntime.defaultSuperCall(this, $PbElement.prototype, arguments);
  };
  var $PbElement = PbElement;
  ($traceurRuntime.createClass)(PbElement, {
    createdCallback: function() {
      this.isCreated = false;
    },
    attachedCallback: function() {
      this.isCreated = true;
    },
    detachedCallback: function() {}
  }, {}, HTMLElement);
  var $__default = PbElement;
  Utils.makeGlobal('pb.PbElement', PbElement);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_component_47_component__ = (function() {
  "use strict";
  var __moduleName = "src/component/component";
  var Utils = ($__src_47_utils__).default;
  var DragDropService = ($__src_47_service_47_dragdrop__).default;
  var PbElement = ($__src_47_pbelement__).default;
  var Component = function Component() {};
  var $Component = Component;
  ($traceurRuntime.createClass)(Component, {createdCallback: function() {
      $traceurRuntime.superCall(this, $Component.prototype, "createdCallback", []);
    }}, {}, PbElement);
  var $__default = Component;
  if (window.TEST_MODE) {
    Utils.makeGlobal('pb.component.Component', Component);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_component_47_card__ = (function() {
  "use strict";
  var __moduleName = "src/component/card";
  var Utils = ($__src_47_utils__).default;
  var Component = ($__src_47_component_47_component__).default;
  var Abilities = ($__src_47_ability_47_abilities__).default;
  var Contextable = ($__src_47_ability_47_contextable__).default;
  var Draggable = ($__src_47_ability_47_draggable__).default;
  var Rotateable = ($__src_47_ability_47_rotateable__).default;
  var Toggleable = ($__src_47_ability_47_toggleable__).default;
  var doc = null;
  var template = null;
  var EL_NAME = 'pb-c-card';
  var Card = function Card() {
    $traceurRuntime.defaultSuperCall(this, $Card.prototype, arguments);
  };
  var $Card = Card;
  ($traceurRuntime.createClass)(Card, {createdCallback: function() {
      $traceurRuntime.superCall(this, $Card.prototype, "createdCallback", []);
      this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
      this.attachedCallback();
    }}, {register: function(currentDoc, cardTemplate) {
      if (!doc && !template) {
        var toggleable = new Toggleable(true);
        var rotateable = new Rotateable();
        var draggable = new Draggable(true);
        document.registerElement(EL_NAME, {prototype: Abilities.config($Card, {'pb-click': toggleable}, draggable, rotateable, new Contextable({
            'Flip': toggleable,
            '-': undefined,
            'sub': {
              'Flip': toggleable,
              'Tap / Untap': rotateable
            }
          })).prototype});
      }
      doc = currentDoc;
      template = cardTemplate;
    }}, Component);
  var $__default = Card;
  Utils.makeGlobal('pb.component.Card', Card);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_component_47_token__ = (function() {
  "use strict";
  var __moduleName = "src/component/token";
  var Component = ($__src_47_component_47_component__).default;
  var Utils = ($__src_47_utils__).default;
  var Abilities = ($__src_47_ability_47_abilities__).default;
  var Draggable = ($__src_47_ability_47_draggable__).default;
  var doc = null;
  var template = null;
  var EL_NAME = 'pb-c-token';
  var Token = function Token() {
    $traceurRuntime.defaultSuperCall(this, $Token.prototype, arguments);
  };
  var $Token = Token;
  ($traceurRuntime.createClass)(Token, {createdCallback: function() {
      $traceurRuntime.superCall(this, $Token.prototype, "createdCallback", []);
      this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
    }}, {register: function(currentDoc, tokenTemplate) {
      if (!doc && !template) {
        var draggable = new Draggable(true);
        document.registerElement(EL_NAME, {prototype: Abilities.config($Token, {}, draggable).prototype});
      }
      doc = currentDoc;
      template = tokenTemplate;
    }}, Component);
  var $__default = Token;
  Utils.makeGlobal('pb.component.Token', Token);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_component_47_modules__ = (function() {
  "use strict";
  var __moduleName = "src/component/modules";
  $__src_47_component_47_card__;
  $__src_47_component_47_token__;
  return {};
})();
var $__src_47_ability_47_droppable__ = (function() {
  "use strict";
  var $__6;
  var __moduleName = "src/ability/droppable";
  var Check = ($__src_47_check__).default;
  var Events = ($__src_47_events__).default;
  var Utils = ($__src_47_utils__).default;
  var Ability = ($__src_47_ability_47_ability__).default;
  var DragDrop = ($__src_47_service_47_dragdrop__).default;
  var ATTR_NAME = 'pb-droppable';
  var CLASS_OVER = 'pb-over';
  var __defaultValue__ = Symbol();
  var __dragEnterCount__ = Symbol();
  var __onDragEnter__ = Symbol('onDragEnter');
  var __onDragLeave__ = Symbol();
  var __onDragOver__ = Symbol();
  var __onLastDraggedElChange__ = Symbol('onLastDraggedElChange');
  var __register__ = Symbol('register');
  var __unregister__ = Symbol('unregister');
  var Droppable = function Droppable(defaultValue) {
    this[$traceurRuntime.toProperty(__defaultValue__)] = defaultValue;
    this[$traceurRuntime.toProperty(__dragEnterCount__)] = 0;
  };
  ($traceurRuntime.createClass)(Droppable, ($__6 = {}, Object.defineProperty($__6, __onDragEnter__, {
    value: function(el) {
      el.classList.add(CLASS_OVER);
      this[$traceurRuntime.toProperty(__dragEnterCount__)]++;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, __onDragLeave__, {
    value: function(el) {
      this[$traceurRuntime.toProperty(__dragEnterCount__)]--;
      if (this[$traceurRuntime.toProperty(__dragEnterCount__)] <= 0) {
        this[$traceurRuntime.toProperty(__dragEnterCount__)] = 0;
        el.classList.remove(CLASS_OVER);
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, __onDragOver__, {
    value: function(el, event) {
      event.preventDefault();
      event.dropEffect = 'move';
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, __onLastDraggedElChange__, {
    value: function(el) {
      if (!DragDrop.lastDraggedEl) {
        this[$traceurRuntime.toProperty(__dragEnterCount__)] = 0;
        el.classList.remove(CLASS_OVER);
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, __register__, {
    value: function(el) {
      Events.of(el, this).listen('dragover', this[$traceurRuntime.toProperty(__onDragOver__)].bind(this, el)).listen('dragenter', this[$traceurRuntime.toProperty(__onDragEnter__)].bind(this, el)).listen('dragleave', this[$traceurRuntime.toProperty(__onDragLeave__)].bind(this, el)).listen('drop', this.trigger.bind(this, el));
      Events.of(DragDrop, this).on(DragDrop.Events.LAST_DRAGGED_EL_CHANGED, this[$traceurRuntime.toProperty(__onLastDraggedElChange__)].bind(this, el));
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, __unregister__, {
    value: function(el) {
      Events.of(el, this).unlisten();
      Events.of(DragDrop, this).off();
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, "setDefaultValue", {
    value: function(el) {
      if ($(el).attr(ATTR_NAME) === undefined) {
        $(el).attr(ATTR_NAME, this[$traceurRuntime.toProperty(__defaultValue__)]);
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, "attributeChangedCallback", {
    value: function(el, name, oldValue, newValue) {
      if (name === ATTR_NAME) {
        newValue = Check(newValue).isBoolean(newValue).orThrows();
        if (newValue) {
          this[$traceurRuntime.toProperty(__register__)](el);
        } else {
          this[$traceurRuntime.toProperty(__unregister__)](el);
        }
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, "attachedCallback", {
    value: function(el) {
      if ($(el).attr(ATTR_NAME) && Check($(el).attr(ATTR_NAME)).isBoolean().orThrows()) {
        this[$traceurRuntime.toProperty(__register__)](el);
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, "detachedCallback", {
    value: function(el) {
      this[$traceurRuntime.toProperty(__unregister__)](el);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, "getMovedElement", {
    value: function(el) {
      return el;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, "trigger", {
    value: function(el, event) {
      el.classList.remove(CLASS_OVER);
      var lastDraggedEl = DragDrop.lastDraggedEl;
      if (lastDraggedEl) {
        el.appendChild(lastDraggedEl);
        if (DragDrop.lastDraggedEl.attachedCallback) {
          DragDrop.lastDraggedEl.attachedCallback();
        }
      }
      DragDrop.dragEnd();
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, "name", {
    get: function() {
      return ATTR_NAME;
    },
    configurable: true,
    enumerable: true
  }), $__6), {}, Ability);
  var $__default = Droppable;
  if (window[$traceurRuntime.toProperty('TEST_MODE')]) {
    Utils.makeGlobal('pb.ability.Droppable', Droppable);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_service_47_distribute__ = (function() {
  "use strict";
  var __moduleName = "src/service/distribute";
  var Utils = ($__src_47_utils__).default;
  var source = null;
  var CLASS_DISTRIBUTE = 'pb-distribute';
  var Distribute = {
    begin: function(distributeSource) {
      if (!this.isActive()) {
        source = distributeSource;
        distributeSource.classList.add(CLASS_DISTRIBUTE);
        $(this).trigger(this.EventType.BEGIN);
      }
    },
    end: function() {
      if (this.isActive()) {
        source.classList.remove(CLASS_DISTRIBUTE);
        source = null;
        $(this).trigger(this.EventType.END);
      }
    },
    isActive: function() {
      return source !== null;
    },
    next: function() {
      return source.next();
    },
    EventType: {
      BEGIN: 'distribute-begin',
      END: 'distribute-end'
    }
  };
  $(window).on('keydown', (function(event) {
    if (event.which === 27 && Distribute.isActive()) {
      Distribute.end();
    }
  }));
  var $__default = Distribute = Distribute;
  Utils.makeGlobal('pb.service.Distribute', Distribute);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_region_47_region__ = (function() {
  "use strict";
  var $__6;
  var __moduleName = "src/region/region";
  var Events = ($__src_47_events__).default;
  var PbElement = ($__src_47_pbelement__).default;
  var Utils = ($__src_47_utils__).default;
  var Distribute = ($__src_47_service_47_distribute__).default;
  var DragDrop = ($__src_47_service_47_dragdrop__).default;
  var CLASS_DISTRIBUTE = 'pb-distribute';
  var __onClick__ = Symbol();
  var __onDistributeBegin__ = Symbol();
  var __onDistributeEnd__ = Symbol();
  var Region = function Region() {};
  var $Region = Region;
  ($traceurRuntime.createClass)(Region, ($__6 = {}, Object.defineProperty($__6, __onClick__, {
    value: function() {
      if (Distribute.isActive() && Distribute.next()) {
        this.appendChild(Distribute.next());
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, __onDistributeBegin__, {
    value: function() {
      if (this.shadowRoot) {
        this.shadowRoot.querySelector('#root').classList.add(CLASS_DISTRIBUTE);
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, __onDistributeEnd__, {
    value: function() {
      if (this.shadowRoot) {
        this.shadowRoot.querySelector('#root').classList.remove(CLASS_DISTRIBUTE);
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, "createdCallback", {
    value: function() {
      $traceurRuntime.superCall(this, $Region.prototype, "createdCallback", []);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, "attachedCallback", {
    value: function() {
      $traceurRuntime.superCall(this, $Region.prototype, "attachedCallback", []);
      Events.of(this, this).listen('click', this[$traceurRuntime.toProperty(__onClick__)].bind(this));
      $(Distribute).on(Distribute.EventType.BEGIN, this[$traceurRuntime.toProperty(__onDistributeBegin__)].bind(this)).on(Distribute.EventType.END, this[$traceurRuntime.toProperty(__onDistributeEnd__)].bind(this));
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__6, "detachedCallback", {
    value: function() {
      Events.of(this, this).unlisten();
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__6), {}, PbElement);
  var $__default = Region;
  Region.ATTR_DROPPABLE = 'pb-droppable';
  if (window.TEST_MODE) {
    Utils.makeGlobal('pb.region.Region', Region);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_region_47_bag__ = (function() {
  "use strict";
  var __moduleName = "src/region/bag";
  var Utils = ($__src_47_utils__).default;
  var Abilities = ($__src_47_ability_47_abilities__).default;
  var Draggable = ($__src_47_ability_47_draggable__).default;
  var Droppable = ($__src_47_ability_47_droppable__).default;
  var Region = ($__src_47_region_47_region__).default;
  var EL_NAME = 'pb-r-bag';
  var ATTR_PLACEHOLDER = 'pb-placeholder';
  var ATTR_PLACEHOLDER_CONTENT = 'pb-placeholder-content';
  var __bag__ = Symbol();
  var __draggable__ = Symbol('draggable');
  var __placeHolderEl__ = Symbol('placeHolderEl');
  var doc = null;
  var template = null;
  var placeHolderTmp = null;
  var BagDraggable = function BagDraggable(bag) {
    $traceurRuntime.superCall(this, $BagDraggable.prototype, "constructor", [true]);
    this[$traceurRuntime.toProperty(__bag__)] = bag;
  };
  var $BagDraggable = BagDraggable;
  ($traceurRuntime.createClass)(BagDraggable, {getMovedElement: function(el) {
      var candidates = Utils.toArray(this[$traceurRuntime.toProperty(__bag__)].children).filter((function(child) {
        return $(child).attr(ATTR_PLACEHOLDER) === undefined;
      }));
      return candidates[$traceurRuntime.toProperty(Math.round(Math.random() * (candidates.length - 1)))];
    }}, {}, Draggable);
  var Bag = function Bag() {
    $traceurRuntime.defaultSuperCall(this, $Bag.prototype, arguments);
  };
  var $Bag = Bag;
  ($traceurRuntime.createClass)(Bag, {
    createdCallback: function() {
      $traceurRuntime.superCall(this, $Bag.prototype, "createdCallback", []);
      this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
      this[$traceurRuntime.toProperty(__placeHolderEl__)] = this.querySelector(("[" + ATTR_PLACEHOLDER + "]"));
      if (!this[$traceurRuntime.toProperty(__placeHolderEl__)]) {
        var placeHolderContent = this.querySelector(("[" + ATTR_PLACEHOLDER_CONTENT + "]")) || Utils.activateTemplate(placeHolderTmp, doc);
        this[$traceurRuntime.toProperty(__placeHolderEl__)] = doc.createElement('div');
        this[$traceurRuntime.toProperty(__placeHolderEl__)].appendChild(placeHolderContent);
        $(this[$traceurRuntime.toProperty(__placeHolderEl__)]).attr(ATTR_PLACEHOLDER, '');
        this.insertBefore(this[$traceurRuntime.toProperty(__placeHolderEl__)], this.lastChild);
      }
      this[$traceurRuntime.toProperty(__draggable__)] = new BagDraggable(this);
      this[$traceurRuntime.toProperty(__draggable__)].setDefaultValue(this[$traceurRuntime.toProperty(__placeHolderEl__)]);
      this.attachedCallback();
    },
    attachedCallback: function() {
      $traceurRuntime.superCall(this, $Bag.prototype, "attachedCallback", []);
      this[$traceurRuntime.toProperty(__draggable__)].attachedCallback(this[$traceurRuntime.toProperty(__placeHolderEl__)]);
    },
    detachedCallback: function() {
      this[$traceurRuntime.toProperty(__draggable__)].detachedCallback(this[$traceurRuntime.toProperty(__placeHolderEl__)]);
      $traceurRuntime.superCall(this, $Bag.prototype, "detachedCallback", []);
    },
    attributeChangedCallback: function(name, oldValue, newValue) {
      this[$traceurRuntime.toProperty(__draggable__)].attributeChangedCallback(this[$traceurRuntime.toProperty(__placeHolderEl__)], name, oldValue, newValue);
    }
  }, {register: function(currentDoc, bagTemplate, placeHolderTemplate) {
      if (!doc || !template) {
        doc = currentDoc;
        template = bagTemplate;
        placeHolderTmp = placeHolderTemplate;
      }
      document.registerElement(EL_NAME, {prototype: Abilities.config($Bag, {}, new Droppable(true)).prototype});
    }}, Region);
  var $__default = Bag;
  Bag.prototype[$traceurRuntime.toProperty(__draggable__)] = null;
  Bag.prototype[$traceurRuntime.toProperty(__placeHolderEl__)] = null;
  Utils.makeGlobal('pb.region.Bag', Bag);
  if (window[$traceurRuntime.toProperty('TEST_MODE')]) {
    Utils.makeGlobal('pb.region.Bag.BagDraggable', BagDraggable);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_ability_47_shuffleable__ = (function() {
  "use strict";
  var __moduleName = "src/ability/shuffleable";
  var Check = ($__src_47_check__).default;
  var Utils = ($__src_47_utils__).default;
  var Ability = ($__src_47_ability_47_ability__).default;
  var ATTR_NAME = 'pb-shuffleable';
  var __defaultEnabled__ = Symbol();
  var Shuffleable = function Shuffleable() {
    var defaultEnabled = arguments[0] !== (void 0) ? arguments[0] : true;
    this[$traceurRuntime.toProperty(__defaultEnabled__)] = defaultEnabled;
  };
  ($traceurRuntime.createClass)(Shuffleable, {
    setDefaultValue: function(el) {
      if ($(el).attr(ATTR_NAME) === undefined) {
        $(el).attr(ATTR_NAME, this[$traceurRuntime.toProperty(__defaultEnabled__)]);
      }
    },
    trigger: function(el) {
      if (Check($(el).attr(ATTR_NAME)).isBoolean().orThrows()) {
        var pairs = Utils.toArray(el.children).map((function(child) {
          return [child, Math.random()];
        }));
        pairs.sort((function(a, b) {
          return Utils.compare(a[1], b[1]);
        }));
        var shuffled = pairs.map((function(pair) {
          return pair[0];
        }));
        shuffled.forEach((function(shuffledEl) {
          return el.appendChild(shuffledEl);
        }));
      }
    },
    get name() {
      return ATTR_NAME;
    }
  }, {}, Ability);
  var $__default = Shuffleable;
  Utils.makeGlobal('pb.ability.Shuffleable', Shuffleable);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_region_47_deck__ = (function() {
  "use strict";
  var $__8;
  var __moduleName = "src/region/deck";
  var Events = ($__src_47_events__).default;
  var Utils = ($__src_47_utils__).default;
  var Abilities = ($__src_47_ability_47_abilities__).default;
  var Droppable = ($__src_47_ability_47_droppable__).default;
  var Shuffleable = ($__src_47_ability_47_shuffleable__).default;
  var Triggerable = ($__src_47_ability_47_triggerable__).default;
  var Region = ($__src_47_region_47_region__).default;
  var doc = null;
  var template = null;
  var EL_NAME = 'pb-r-deck';
  var Deck = function Deck() {
    $traceurRuntime.defaultSuperCall(this, $Deck.prototype, arguments);
  };
  var $Deck = Deck;
  ($traceurRuntime.createClass)(Deck, {
    createdCallback: function() {
      $traceurRuntime.superCall(this, $Deck.prototype, "createdCallback", []);
      this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
      this.attachedCallback();
    },
    attachedCallback: function() {
      $traceurRuntime.superCall(this, $Deck.prototype, "attachedCallback", []);
    },
    detachedCallback: function() {
      $traceurRuntime.superCall(this, $Deck.prototype, "detachedCallback", []);
    }
  }, ($__8 = {}, Object.defineProperty($__8, "register", {
    value: function(currentDoc, deckTemplate) {
      var $__8,
          $__9;
      if (!doc || !template) {
        doc = currentDoc;
        template = deckTemplate;
      }
      document.registerElement(EL_NAME, ($__9 = {}, Object.defineProperty($__9, "prototype", {
        value: Abilities.config($Deck, ($__8 = {}, Object.defineProperty($__8, Triggerable.TYPES.DOUBLE_CLICK, {
          value: new Shuffleable(true),
          configurable: true,
          enumerable: true,
          writable: true
        }), $__8), new Droppable(true)).prototype,
        configurable: true,
        enumerable: true,
        writable: true
      }), $__9));
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__8), Region);
  var $__default = Deck;
  Utils.makeGlobal('pb.region.Deck', Deck);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_region_47_rect__ = (function() {
  "use strict";
  var __moduleName = "src/region/rect";
  var Utils = ($__src_47_utils__).default;
  var Abilities = ($__src_47_ability_47_abilities__).default;
  var Droppable = ($__src_47_ability_47_droppable__).default;
  var Region = ($__src_47_region_47_region__).default;
  var DragDrop = ($__src_47_service_47_dragdrop__).default;
  var doc = null;
  var template = null;
  var EL_NAME = 'pb-r-rect';
  var SmartDroppable = function SmartDroppable(defaultValue) {
    $traceurRuntime.superCall(this, $SmartDroppable.prototype, "constructor", [defaultValue]);
  };
  var $SmartDroppable = SmartDroppable;
  ($traceurRuntime.createClass)(SmartDroppable, {trigger: function(el, event) {
      el.classList.remove('pb-over');
      var lastDraggedEl = DragDrop.lastDraggedEl;
      if (!lastDraggedEl) {
        return;
      }
      el.appendChild(lastDraggedEl);
      var screenCoord = lastDraggedEl.getBoundingClientRect();
      var dLeft = event.clientX - screenCoord.left - DragDrop.offsetX;
      var dTop = event.clientY - screenCoord.top - DragDrop.offsetY;
      lastDraggedEl.style.left = ((lastDraggedEl.offsetLeft + dLeft) + "px");
      lastDraggedEl.style.top = ((lastDraggedEl.offsetTop + dTop) + "px");
      if (DragDrop.lastDraggedEl.attachedCallback) {
        DragDrop.lastDraggedEl.attachedCallback();
      }
      DragDrop.dragEnd();
    }}, {}, Droppable);
  var Rect = function Rect() {
    $traceurRuntime.superCall(this, $Rect.prototype, "constructor", []);
  };
  var $Rect = Rect;
  ($traceurRuntime.createClass)(Rect, {createdCallback: function() {
      $traceurRuntime.superCall(this, $Rect.prototype, "createdCallback", []);
      this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
    }}, {register: function(currentDoc, rectTemplate) {
      if (doc || template) {
        return;
      }
      doc = currentDoc;
      template = rectTemplate;
      document.registerElement(EL_NAME, {prototype: Abilities.config($Rect, {}, new SmartDroppable(true)).prototype});
    }}, Region);
  var $__default = Rect = Rect;
  Utils.makeGlobal('pb.region.Rect', Rect);
  if (window[$traceurRuntime.toProperty('TEST_MODE')]) {
    Utils.makeGlobal('pb.region.Rect.SmartDroppable', SmartDroppable);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_region_47_modules__ = (function() {
  "use strict";
  var __moduleName = "src/region/modules";
  $__src_47_region_47_bag__;
  $__src_47_region_47_deck__;
  $__src_47_region_47_rect__;
  return {};
})();
var $__src_47_surface_47_rectgrid__ = (function() {
  "use strict";
  var __moduleName = "src/surface/rectgrid";
  var Check = ($__src_47_check__).default;
  var PbElement = ($__src_47_pbelement__).default;
  var Utils = ($__src_47_utils__).default;
  var doc = null;
  var templates = null;
  var ATTR_ROW = 'pb-row';
  var ATTR_COL = 'pb-col';
  var EL_NAME = 'pb-s-rectgrid';
  var RectGrid = function RectGrid() {
    $traceurRuntime.defaultSuperCall(this, $RectGrid.prototype, arguments);
  };
  var $RectGrid = RectGrid;
  ($traceurRuntime.createClass)(RectGrid, {
    createdCallback: function() {
      $traceurRuntime.superCall(this, $RectGrid.prototype, "createdCallback", []);
      this.createShadowRoot().appendChild(Utils.activateTemplate(templates.main, doc));
      var rowCount = Check($(this).attr(ATTR_ROW)).isInt().orThrows();
      var colCount = Check($(this).attr(ATTR_COL)).isInt().orThrows();
      var rootEl = this.shadowRoot.querySelector('#content');
      for (var row = 0; row < rowCount; row++) {
        rootEl.appendChild(Utils.activateTemplate(templates.row, doc));
      }
      $(this.shadowRoot.querySelectorAll('#content > div')).each((function(row, rowEl) {
        for (var col = 0; col < colCount; col++) {
          var colEl = Utils.activateTemplate(templates.col, doc);
          $(colEl.querySelector('content')).attr('select', ("[" + ATTR_ROW + "=\"" + row + "\"][" + ATTR_COL + "=\"" + col + "\"]")).attr(ATTR_ROW, row).attr(ATTR_COL, col);
          rowEl.appendChild(colEl);
        }
      }));
    },
    attachedCallback: function() {
      $traceurRuntime.superCall(this, $RectGrid.prototype, "attachedCallback", []);
    },
    get: function(row, col) {
      var contentEl = this.shadowRoot.querySelector(("content[" + ATTR_ROW + "=\"" + row + "\"][" + ATTR_COL + "=\"" + col + "\"]"));
      return contentEl ? contentEl.getDistributedNodes()[0] : null;
    }
  }, {register: function(currentDoc, gridTemplates) {
      if (doc || templates) {
        return;
      }
      doc = currentDoc;
      templates = gridTemplates;
      document.registerElement(EL_NAME, {prototype: $RectGrid.prototype});
    }}, PbElement);
  var $__default = RectGrid;
  Utils.makeGlobal('pb.surface.RectGrid', RectGrid);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_surface_47_modules__ = (function() {
  "use strict";
  var __moduleName = "src/surface/modules";
  $__src_47_surface_47_rectgrid__;
  return {};
})();
var $__src_47_service_47_preview__ = (function() {
  "use strict";
  var __moduleName = "src/service/preview";
  var Utils = ($__src_47_utils__).default;
  var Preview = {previewedEl: null};
  var $__default = Preview = Preview;
  Utils.makeGlobal('pb.service.Preview', Preview);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_ui_47_preview__ = (function() {
  "use strict";
  var __moduleName = "src/ui/preview";
  var Events = ($__src_47_events__).default;
  var PbElement = ($__src_47_pbelement__).default;
  var Utils = ($__src_47_utils__).default;
  var PreviewService = ($__src_47_service_47_preview__).default;
  var registered = false;
  var EL_NAME = 'pb-u-preview';
  function handleMouseOver() {
    PreviewService.previewedEl = this;
  }
  function handleMouseOut(e) {
    PreviewService.previewedEl = null;
  }
  var Preview = function Preview() {
    $traceurRuntime.defaultSuperCall(this, $Preview.prototype, arguments);
  };
  var $Preview = Preview;
  ($traceurRuntime.createClass)(Preview, {
    createdCallback: function() {
      $traceurRuntime.superCall(this, $Preview.prototype, "createdCallback", []);
      this.createShadowRoot();
      this.attachedCallback();
    },
    attachedCallback: function() {
      $traceurRuntime.superCall(this, $Preview.prototype, "attachedCallback", []);
      if (this.parentElement) {
        Events.of(this.parentElement, this).listen('mouseenter', handleMouseOver.bind(this)).listen('mouseleave', handleMouseOut.bind(this));
      }
    },
    detachedCallback: function() {
      if (this.parentElement) {
        Events.of(this.parentElement, this).unlisten();
      }
      $traceurRuntime.superCall(this, $Preview.prototype, "detachedCallback", []);
    }
  }, {register: function() {
      if (!registered) {
        document.registerElement(EL_NAME, {prototype: $Preview.prototype});
      }
    }}, PbElement);
  var $__default = Preview;
  Utils.makeGlobal('pb.ui.Preview', Preview);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_ui_47_previewer__ = (function() {
  "use strict";
  var __moduleName = "src/ui/previewer";
  var PbElement = ($__src_47_pbelement__).default;
  var Utils = ($__src_47_utils__).default;
  var PreviewService = ($__src_47_service_47_preview__).default;
  var template = null;
  var doc = null;
  var _previewElHandler = Symbol();
  var EL_NAME = 'pb-u-previewer';
  function handlePreviewEl() {
    if (PreviewService.previewedEl) {
      this.innerHTML = PreviewService.previewedEl.innerHTML;
    } else {
      this.innerHTML = '';
    }
  }
  var Previewer = function Previewer() {
    $traceurRuntime.defaultSuperCall(this, $Previewer.prototype, arguments);
  };
  var $Previewer = Previewer;
  ($traceurRuntime.createClass)(Previewer, {
    createdCallback: function() {
      $traceurRuntime.superCall(this, $Previewer.prototype, "createdCallback", []);
      this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
      this.attachedCallback();
    },
    attachedCallback: function() {
      $traceurRuntime.superCall(this, $Previewer.prototype, "attachedCallback", []);
      this[$traceurRuntime.toProperty(_previewElHandler)] = Utils.observe(PreviewService, 'previewedEl', handlePreviewEl.bind(this));
    },
    detachedCallback: function() {
      Object.unobserve(PreviewService, this[$traceurRuntime.toProperty(_previewElHandler)]);
      $traceurRuntime.superCall(this, $Previewer.prototype, "detachedCallback", []);
    }
  }, {register: function(currentDoc, previewerTemplate) {
      if (!template && !doc) {
        document.registerElement(EL_NAME, {prototype: $Previewer.prototype});
      }
      template = previewerTemplate;
      doc = currentDoc;
    }}, PbElement);
  var $__default = Previewer;
  Utils.makeGlobal('pb.ui.Previewer', Previewer);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_ui_47_template__ = (function() {
  "use strict";
  var __moduleName = "src/ui/template";
  var Check = ($__src_47_check__).default;
  var PbElement = ($__src_47_pbelement__).default;
  var Utils = ($__src_47_utils__).default;
  var doc = null;
  var handlebars = null;
  var EL_NAME = 'pb-u-template';
  var Template = function Template() {
    $traceurRuntime.superCall(this, $Template.prototype, "constructor", []);
  };
  var $Template = Template;
  ($traceurRuntime.createClass)(Template, {createdCallback: function() {
      $traceurRuntime.superCall(this, $Template.prototype, "createdCallback", []);
      var templateStr = this.innerHTML;
      var data = {};
      for (var key in this.dataset)
        if (!$traceurRuntime.isSymbolString(key)) {
          var valueStr = this.dataset[$traceurRuntime.toProperty(key)];
          data[$traceurRuntime.toProperty(key)] = window[$traceurRuntime.toProperty(valueStr)] || valueStr;
        }
      $(this).replaceWith(handlebars.compile(this.innerHTML)(data));
    }}, {register: function(currentDoc, handlebars_ref) {
      if (!doc && !handlebars) {
        document.registerElement(EL_NAME, {prototype: $Template.prototype});
      }
      doc = currentDoc;
      handlebars = handlebars_ref;
      handlebars.registerHelper('pb-for', function(from, to, step, options) {
        if (options === undefined) {
          options = step;
          step = 1;
        }
        var rv = '';
        for (var i = Check(from).isInt().orThrows(); i < Check(to).isInt().orThrows(); i += Check(step).isInt().orThrows()) {
          var data = Handlebars.createFrame(options.data || {});
          data.index = i;
          rv += options.fn(this, {data: data});
        }
        return rv;
      });
    }}, PbElement);
  var $__default = Template;
  Utils.makeGlobal('pb.ui.Template', Template);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_ui_47_modules__ = (function() {
  "use strict";
  var __moduleName = "src/ui/modules";
  $__src_47_ui_47_preview__;
  $__src_47_ui_47_previewer__;
  $__src_47_ui_47_template__;
  return {};
})();
var $__src_47_modules__ = (function() {
  "use strict";
  var __moduleName = "src/modules";
  $__src_47_check__;
  $__src_47_utils__;
  $__src_47_ability_47_modules__;
  $__src_47_component_47_modules__;
  $__src_47_region_47_modules__;
  $__src_47_surface_47_modules__;
  $__src_47_ui_47_modules__;
  return {};
})();

//# sourceMappingURL=main.map
