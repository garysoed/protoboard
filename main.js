var $__src_47_ability_47_ability__ = (function() {
  "use strict";
  var __moduleName = "src/ability/ability";
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
  return {get default() {
      return $__default;
    }};
})();
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
      return handler;
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
  var __getEvent__ = Symbol('getEvent');
  var __getTriggers__ = Symbol('getTriggers');
  var __isRegistered__ = Symbol('isRegistered');
  var __knownAbilities__ = Symbol();
  var __register__ = Symbol('register');
  var __triggers__ = Symbol();
  var __unregister__ = Symbol('unregister');
  var __handler__ = Symbol();
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
  var Utils = ($__src_47_utils__).default;
  var Triggerable = ($__src_47_ability_47_triggerable__).default;
  var __register__ = Symbol();
  var Abilities = ($__2 = {}, Object.defineProperty($__2, __register__, {
    value: function(ctorProto, ability) {
      Utils.extendFn(ctorProto, 'createdCallback', function() {
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
      var knownAbilities = [];
      for (var key in cfg)
        if (!$traceurRuntime.isSymbolString(key)) {
          var ability = cfg[$traceurRuntime.toProperty(key)];
          knownAbilities.push(ability);
          this[$traceurRuntime.toProperty(__register__)](ctorProto, ability);
          triggerConfig[$traceurRuntime.toProperty(key)] = ability.name;
        }
      for (var $__3 = abilities[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__4; !($__4 = $__3.next()).done; ) {
        var ability$__6 = $__4.value;
        {
          knownAbilities.push(ability$__6);
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
var $__src_47_service_47_dragdrop__ = (function() {
  "use strict";
  var __moduleName = "src/service/dragdrop";
  var Utils = ($__src_47_utils__).default;
  var DragDrop = {
    lastDraggedEl: null,
    dragStart: function(draggedEl) {
      this.lastDraggedEl = draggedEl;
    }
  };
  var $__default = DragDrop = DragDrop;
  Utils.makeGlobal('pb.service.DragDrop', DragDrop);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_ability_47_draggable__ = (function() {
  "use strict";
  var __moduleName = "src/ability/draggable";
  var Check = ($__src_47_check__).default;
  var Utils = ($__src_47_utils__).default;
  var Ability = ($__src_47_ability_47_ability__).default;
  var DragDropService = ($__src_47_service_47_dragdrop__).default;
  var ATTR_NAME = 'pb-draggable';
  var CLASS_DRAGGED = 'pb-dragged';
  var _DEFAULT_VALUE = Symbol();
  var _DRAG_START_HANDLER = Symbol();
  var _DRAG_END_HANDLER = Symbol();
  function handleDragEnd() {
    this.classList.remove(CLASS_DRAGGED);
  }
  function handleDragStart(event) {
    var dataTransfer = event.dataTransfer;
    dataTransfer.effectAllowed = 'move';
    this.classList.add(CLASS_DRAGGED);
    DragDropService.dragStart(this);
  }
  function register(element) {
    element[$traceurRuntime.toProperty(_DRAG_START_HANDLER)] = handleDragStart.bind(element);
    element[$traceurRuntime.toProperty(_DRAG_END_HANDLER)] = handleDragEnd.bind(element);
    Utils.toArray(element.children).forEach((function(child) {
      $(child).attr('draggable', 'true');
      child.addEventListener('dragstart', element[$traceurRuntime.toProperty(_DRAG_START_HANDLER)]);
      child.addEventListener('dragend', element[$traceurRuntime.toProperty(_DRAG_END_HANDLER)]);
    }));
  }
  function unregister(element) {
    Utils.toArray(element.children).forEach((function(child) {
      child.removeEventListener('dragend', element[$traceurRuntime.toProperty(_DRAG_END_HANDLER)]);
      child.removeEventListener('dragstart', element[$traceurRuntime.toProperty(_DRAG_START_HANDLER)]);
      $(child).attr('draggable', null);
    }));
  }
  var Draggable = function Draggable(defaultValue) {
    this[$traceurRuntime.toProperty(_DEFAULT_VALUE)] = defaultValue;
  };
  ($traceurRuntime.createClass)(Draggable, {
    setDefaultValue: function(el) {
      if ($(el).attr(ATTR_NAME) === undefined) {
        $(el).attr(ATTR_NAME, this[$traceurRuntime.toProperty(_DEFAULT_VALUE)]);
      }
    },
    attributeChangedCallback: function(el, name, oldValue, newValue) {
      if (name === ATTR_NAME) {
        newValue = Check(newValue).isBoolean(newValue).orThrows();
        if (newValue) {
          register(el);
        } else {
          unregister(el);
        }
      }
    },
    attachedCallback: function(el) {
      if ($(el).attr(ATTR_NAME) && Check($(el).attr(ATTR_NAME)).isBoolean().orThrows()) {
        register(el);
      }
    },
    detachedCallback: function(el) {
      unregister(el);
    },
    get name() {
      return ATTR_NAME;
    }
  }, {}, Ability);
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
  var __moduleName = "src/ability/toggleable";
  var Check = ($__src_47_check__).default;
  var Utils = ($__src_47_utils__).default;
  var Ability = ($__src_47_ability_47_ability__).default;
  var Triggerable = ($__src_47_ability_47_triggerable__).default;
  var ATTR_NAME = 'pb-toggleable';
  var ATTR_SHOWFRONT = 'pb-showfront';
  var __defaultEnabled__ = Symbol();
  var __defaultShowFront__ = Symbol();
  function isEnabled(el) {
    return Check($(el).attr(ATTR_NAME)).isBoolean().orThrows();
  }
  function isShowFront(el) {
    return Check($(el).attr(ATTR_SHOWFRONT)).isBoolean().orThrows();
  }
  var Toggleable = function Toggleable() {
    var defaultEnabled = arguments[0] !== (void 0) ? arguments[0] : true;
    var defaultShowFront = arguments[1] !== (void 0) ? arguments[1] : false;
    this[$traceurRuntime.toProperty(__defaultEnabled__)] = defaultEnabled;
    this[$traceurRuntime.toProperty(__defaultShowFront__)] = defaultShowFront;
  };
  ($traceurRuntime.createClass)(Toggleable, {
    setDefaultValue: function(el) {
      if ($(el).attr(ATTR_NAME) === undefined) {
        $(el).attr(ATTR_NAME, this[$traceurRuntime.toProperty(__defaultEnabled__)]);
      }
      if ($(el).attr(ATTR_SHOWFRONT) === undefined) {
        $(el).attr(ATTR_SHOWFRONT, this[$traceurRuntime.toProperty(__defaultShowFront__)]);
      }
    },
    trigger: function(el) {
      if (isEnabled(el)) {
        $(el).attr(ATTR_SHOWFRONT, !isShowFront(el));
      }
    },
    get name() {
      return ATTR_NAME;
    }
  }, {}, Ability);
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
        document.registerElement(EL_NAME, {prototype: Abilities.config($Card, {'pb-click': new Toggleable(true)}, new Draggable(true), new Rotateable()).prototype});
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
      if (doc || template) {
        return;
      }
      doc = currentDoc;
      template = tokenTemplate;
      document.registerElement(EL_NAME, {prototype: Abilities.config($Token, {}, new Draggable(true)).prototype});
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
  var __moduleName = "src/region/region";
  var Distribute = ($__src_47_service_47_distribute__).default;
  var DragDrop = ($__src_47_service_47_dragdrop__).default;
  var PbElement = ($__src_47_pbelement__).default;
  var Utils = ($__src_47_utils__).default;
  var CLASS_DISTRIBUTE = 'pb-distribute';
  var CLASS_OVER = 'pb-over';
  var _dragEnterCount = Symbol();
  function handleDragOver(event) {
    event.preventDefault();
    event.dropEffect = 'move';
  }
  function handleDragEnter(e) {
    this.classList.add(CLASS_OVER);
    this[$traceurRuntime.toProperty(_dragEnterCount)]++;
  }
  function handleDragLeave(e) {
    this[$traceurRuntime.toProperty(_dragEnterCount)]--;
    if (this[$traceurRuntime.toProperty(_dragEnterCount)] <= 0) {
      this.classList.remove(CLASS_OVER);
      this[$traceurRuntime.toProperty(_dragEnterCount)] = 0;
    }
  }
  function handleDrop() {
    this.classList.remove(CLASS_OVER);
    this.appendChild(DragDrop.lastDraggedEl);
    if (DragDrop.lastDraggedEl.attachedCallback) {
      DragDrop.lastDraggedEl.attachedCallback();
    }
    DragDrop.lastDraggedEl = null;
  }
  function handleClick() {
    if (Distribute.isActive() && Distribute.next()) {
      this.appendChild(Distribute.next());
    }
  }
  function handleDistributeBegin() {
    if (this.shadowRoot) {
      this.shadowRoot.querySelector('#root').classList.add(CLASS_DISTRIBUTE);
    }
  }
  function handleDistributeEnd() {
    if (this.shadowRoot) {
      this.shadowRoot.querySelector('#root').classList.remove(CLASS_DISTRIBUTE);
    }
  }
  function handleLastDraggedElChange() {
    if (!DragDrop.lastDraggedEl) {
      this.classList.remove(CLASS_OVER);
      this[$traceurRuntime.toProperty(_dragEnterCount)] = 0;
    }
  }
  var Region = function Region() {};
  var $Region = Region;
  ($traceurRuntime.createClass)(Region, {
    createdCallback: function() {
      $traceurRuntime.superCall(this, $Region.prototype, "createdCallback", []);
      this[$traceurRuntime.toProperty(_dragEnterCount)] = 0;
    },
    attachedCallback: function() {
      $traceurRuntime.superCall(this, $Region.prototype, "attachedCallback", []);
      this.addEventListener('dragover', handleDragOver);
      this.addEventListener('dragenter', handleDragEnter);
      this.addEventListener('dragleave', handleDragLeave);
      this.addEventListener('drop', handleDrop);
      this.addEventListener('click', handleClick);
      $(Distribute).on(Distribute.EventType.BEGIN, handleDistributeBegin.bind(this)).on(Distribute.EventType.END, handleDistributeEnd.bind(this));
      Utils.observe(DragDrop, 'lastDraggedEl', handleLastDraggedElChange.bind(this));
    }
  }, {}, PbElement);
  var $__default = Region;
  Region.ATTR_DROPPABLE = 'pb-droppable';
  if (window.TEST_MODE) {
    Utils.makeGlobal('pb.region.Region', Region);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_region_47_bank__ = (function() {
  "use strict";
  var __moduleName = "src/region/bank";
  var Region = ($__src_47_region_47_region__).default;
  var Distribute = ($__src_47_service_47_distribute__).default;
  var Utils = ($__src_47_utils__).default;
  var doc = null;
  var template = null;
  var EL_NAME = 'pb-r-bank';
  function handleDistributeClick(event) {
    this.distribute();
    event.stopPropagation();
  }
  var Bank = function Bank() {
    $traceurRuntime.superCall(this, $Bank.prototype, "constructor", []);
  };
  var $Bank = Bank;
  ($traceurRuntime.createClass)(Bank, {
    createdCallback: function() {
      $traceurRuntime.superCall(this, $Bank.prototype, "createdCallback", []);
      this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
      this.shadowRoot.querySelector('#distribute').addEventListener('click', handleDistributeClick.bind(this));
    },
    distribute: function() {
      Distribute.begin(this);
    },
    next: function() {
      return this.children[0];
    }
  }, {register: function(currentDoc, bankTemplate) {
      if (doc || template) {
        return;
      }
      doc = currentDoc;
      template = bankTemplate;
      document.registerElement(EL_NAME, {prototype: $Bank.prototype});
    }}, Region);
  var $__default = Bank = Bank;
  Utils.makeGlobal('pb.region.Bank', Bank);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_region_47_deck__ = (function() {
  "use strict";
  var __moduleName = "src/region/deck";
  var Region = ($__src_47_region_47_region__).default;
  var Utils = ($__src_47_utils__).default;
  var doc = null;
  var template = null;
  var EL_NAME = 'pb-r-deck';
  var Deck = function Deck() {
    $traceurRuntime.superCall(this, $Deck.prototype, "constructor", []);
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
      this.shadowRoot.querySelector('#shuffle').addEventListener('click', this.shuffle.bind(this));
    },
    shuffle: function() {
      var $__2 = this;
      var pairs = Utils.toArray(this.children).map((function(child) {
        return [child, Math.random()];
      }));
      pairs.sort((function(a, b) {
        return Utils.compare(a[1], b[1]);
      }));
      var shuffled = pairs.map((function(pair) {
        return pair[0];
      }));
      shuffled.forEach(((function(el) {
        return $__2.appendChild(el);
      })).bind(this));
    }
  }, {register: function(currentDoc, deckTemplate) {
      if (doc || template) {
        return;
      }
      doc = currentDoc;
      template = deckTemplate;
      document.registerElement(EL_NAME, {prototype: $Deck.prototype});
    }}, Region);
  var $__default = Deck = Deck;
  Utils.makeGlobal('pb.region.Deck', Deck);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_region_47_rect__ = (function() {
  "use strict";
  var __moduleName = "src/region/rect";
  var Region = ($__src_47_region_47_region__).default;
  var Utils = ($__src_47_utils__).default;
  var doc = null;
  var template = null;
  var EL_NAME = 'pb-r-rect';
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
      document.registerElement(EL_NAME, {prototype: $Rect.prototype});
    }}, Region);
  var $__default = Rect = Rect;
  Utils.makeGlobal('pb.region.Rect', Rect);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_region_47_modules__ = (function() {
  "use strict";
  var __moduleName = "src/region/modules";
  $__src_47_region_47_bank__;
  $__src_47_region_47_deck__;
  $__src_47_region_47_rect__;
  return {};
})();
var $__src_47_service_47_context__ = (function() {
  "use strict";
  var __moduleName = "src/service/context";
  var Utils = ($__src_47_utils__).default;
  var activeContext = null;
  var Context = {
    setActive: function(active) {
      activeContext = active;
      $(this).trigger(this.EventType.SWITCHED);
    },
    getActive: function() {
      return activeContext;
    },
    EventType: {SWITCHED: 'context-switched'}
  };
  var $__default = Context = Context;
  Utils.makeGlobal('pb.service.Context', Context);
  return {get default() {
      return $__default;
    }};
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
var $__src_47_service_47_modules__ = (function() {
  "use strict";
  var __moduleName = "src/service/modules";
  var Context = ($__src_47_service_47_context__).default;
  var Distribute = ($__src_47_service_47_distribute__).default;
  var DragDrop = ($__src_47_service_47_dragdrop__).default;
  var Preview = ($__src_47_service_47_preview__).default;
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
var $__src_47_ui_47_context__ = (function() {
  "use strict";
  var __moduleName = "src/ui/context";
  var Utils = ($__src_47_utils__).default;
  var ContextService = ($__src_47_service_47_context__).default;
  var template = null;
  var doc = null;
  var EL_NAME = "pb-u-context";
  var SHOWN_CLASS = "shown";
  function handleContextMenu(event) {
    this.show(event.x, event.y);
    event.preventDefault();
  }
  function handleClick(event) {
    if (!this.contains(event.target)) {
      this.hide();
    }
  }
  function handleContextSwitched() {
    if (ContextService.getActive() !== this) {
      this.hide();
    }
  }
  var Context = function Context() {};
  var $Context = Context;
  ($traceurRuntime.createClass)(Context, {
    createdCallback: function() {
      this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
      this.attachedCallback();
    },
    attachedCallback: function() {
      if (this.parentElement) {
        this.parentElement.addEventListener('contextmenu', handleContextMenu.bind(this));
      }
      document.addEventListener('click', handleClick.bind(this));
      $(ContextService).on(ContextService.EventType.SWITCHED, handleContextSwitched.bind(this));
    },
    show: function(mouseX, mouseY) {
      var rootEl = this.shadowRoot.querySelector('#root');
      rootEl.classList.add(SHOWN_CLASS);
      var x = null;
      var hAnchor = null;
      var documentEl = this.ownerDocument.documentElement;
      if (mouseX + rootEl.clientWidth > documentEl.clientWidth) {
        hAnchor = 'right';
        x = documentEl.clientWidth - mouseX;
      } else {
        hAnchor = 'left';
        x = mouseX;
      }
      var y = null;
      var vAnchor = null;
      if (mouseY + rootEl.clientHeight > documentEl.clientHeight) {
        vAnchor = 'bottom';
        y = documentEl.clientHeight - mouseY;
      } else {
        vAnchor = 'top';
        y = mouseY;
      }
      this.style.position = 'fixed';
      this.style.top = '';
      this.style.left = '';
      this.style.right = '';
      this.style.bottom = '';
      this.style[$traceurRuntime.toProperty(hAnchor)] = (x + "px");
      this.style[$traceurRuntime.toProperty(vAnchor)] = (y + "px");
      ContextService.setActive(this);
    },
    hide: function() {
      this.shadowRoot.querySelector('#root').classList.remove(SHOWN_CLASS);
    }
  }, {register: function(currentDoc, contextTemplate) {
      if (doc || template) {
        return;
      }
      doc = currentDoc;
      template = contextTemplate;
      document.registerElement(EL_NAME, {prototype: $Context.prototype});
    }}, HTMLElement);
  var $__default = Context = Context;
  Utils.makeGlobal('pb.ui.Context', Context);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_ui_47_preview__ = (function() {
  "use strict";
  var __moduleName = "src/ui/preview";
  var PbElement = ($__src_47_pbelement__).default;
  var Utils = ($__src_47_utils__).default;
  var PreviewService = ($__src_47_service_47_preview__).default;
  var registered = false;
  var EL_NAME = 'pb-u-preview';
  var _mouseOverHandler = Symbol();
  var _mouseOutHandler = Symbol();
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
      this[$traceurRuntime.toProperty(_mouseOverHandler)] = handleMouseOver.bind(this);
      this[$traceurRuntime.toProperty(_mouseOutHandler)] = handleMouseOut.bind(this);
      this.attachedCallback();
    },
    attachedCallback: function() {
      $traceurRuntime.superCall(this, $Preview.prototype, "attachedCallback", []);
      if (this.parentElement) {
        this.parentElement.addEventListener('mouseenter', this[$traceurRuntime.toProperty(_mouseOverHandler)]);
        this.parentElement.addEventListener('mouseleave', this[$traceurRuntime.toProperty(_mouseOutHandler)]);
      }
    },
    detachedCallback: function() {
      if (this.parentElement) {
        this.parentElement.removeEventListener('mouseenter', this[$traceurRuntime.toProperty(_mouseOverHandler)]);
        this.parentElement.removeEventListener('mouseleave', this[$traceurRuntime.toProperty(_mouseOutHandler)]);
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
  $__src_47_ui_47_context__;
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
  $__src_47_service_47_modules__;
  $__src_47_surface_47_modules__;
  $__src_47_ui_47_modules__;
  return {};
})();

//# sourceMappingURL=main.map
