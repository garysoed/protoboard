var $__src_47_as__ = (function() {
  "use strict";
  var __moduleName = "src/as";
  function require(path) {
    return $traceurRuntime.require("src/as", path);
  }
  var As = {
    int: function(input) {
      var radix = arguments[1] !== (void 0) ? arguments[1] : 10;
      var output = Number.parseInt(input, radix);
      if (Number.isNaN(output)) {
        throw (input + " is not an integer with radix " + radix);
      }
      return output;
    },
    boolean: function(input) {
      return input.toLowerCase() === 'true';
    }
  };
  var $__default = As = As;
  if (!window.pb) {
    window.pb = {};
  }
  window.pb.As = As;
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_utils__ = (function() {
  "use strict";
  var __moduleName = "src/utils";
  function require(path) {
    return $traceurRuntime.require("src/utils", path);
  }
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
      Object.observe(object, function(changes) {
        changes.forEach((function(change) {
          if (!property || change.name === property) {
            handler(change.name, change.type, change.oldValue);
          }
        }));
      });
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
    }
  };
  var $__default = Utils = Utils;
  Utils.makeGlobal('pb.Utils', Utils);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_service_47_dragdrop__ = (function() {
  "use strict";
  var __moduleName = "src/service/dragdrop";
  function require(path) {
    return $traceurRuntime.require("src/service/dragdrop", path);
  }
  var Utils = ($__src_47_utils__).default;
  var DragDrop = {
    EventType: {DRAGGED: 'dragged'},
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
var $__src_47_component_47_component__ = (function() {
  "use strict";
  var __moduleName = "src/component/component";
  function require(path) {
    return $traceurRuntime.require("src/component/component", path);
  }
  var Utils = ($__src_47_utils__).default;
  var DragDropService = ($__src_47_service_47_dragdrop__).default;
  var ATTR_DRAGGABLE = 'draggable';
  function setupDraggable() {
    var draggables = this.querySelectorAll('*[draggable="true"]');
    for (var i = 0; i < draggables.length; i++) {
      draggables.item(i).addEventListener('dragstart', handleDragStart.bind(this));
    }
  }
  function handleDragStart(event) {
    var dataTransfer = event.dataTransfer;
    dataTransfer.effectAllowed = 'move';
    DragDropService.dragStart(this);
  }
  var Component = function Component() {};
  ($traceurRuntime.createClass)(Component, {
    createdCallback: function() {},
    config: function(config) {
      if (config.draggable) {
        setupDraggable.bind(this)();
      }
    }
  }, {}, HTMLElement);
  var $__default = Component;
  if (window.TEST_MODE) {
    Utils.makeGlobal('pb.component.Component', Component);
    console.log(pb.component.Component);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_component_47_card__ = (function() {
  "use strict";
  var __moduleName = "src/component/card";
  function require(path) {
    return $traceurRuntime.require("src/component/card", path);
  }
  var As = ($__src_47_as__).default;
  var Component = ($__src_47_component_47_component__).default;
  var Utils = ($__src_47_utils__).default;
  var doc = null;
  var template = null;
  var EL_NAME = 'pb-c-card';
  var ATTR_SHOW_FRONT = 'showFront';
  function handleClick() {
    var oldValue = As.boolean($(this).attr(ATTR_SHOW_FRONT) || 'false');
    $(this).attr(ATTR_SHOW_FRONT, !oldValue);
  }
  var Card = function Card() {
    $traceurRuntime.superConstructor($Card).call(this);
  };
  var $Card = Card;
  ($traceurRuntime.createClass)(Card, {createdCallback: function() {
      $traceurRuntime.superGet(this, $Card.prototype, "createdCallback").call(this);
      var shadowRoot = this.createShadowRoot();
      shadowRoot.appendChild(Utils.activateTemplate(template, doc));
      this.addEventListener('click', handleClick.bind(this));
      this.config({draggable: true});
    }}, {register: function(currentDoc, cardTemplate) {
      if (doc || template) {
        return;
      }
      doc = currentDoc;
      template = cardTemplate;
      document.registerElement(EL_NAME, {prototype: $Card.prototype});
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
  function require(path) {
    return $traceurRuntime.require("src/component/token", path);
  }
  var Component = ($__src_47_component_47_component__).default;
  var Utils = ($__src_47_utils__).default;
  var doc = null;
  var template = null;
  var EL_NAME = 'pb-c-token';
  var Token = function Token() {
    $traceurRuntime.superConstructor($Token).call(this);
  };
  var $Token = Token;
  ($traceurRuntime.createClass)(Token, {createdCallback: function() {
      $traceurRuntime.superGet(this, $Token.prototype, "createdCallback").call(this);
      var shadowRoot = this.createShadowRoot();
      shadowRoot.appendChild(Utils.activateTemplate(template, doc));
      this.config({draggable: true});
    }}, {register: function(currentDoc, tokenTemplate) {
      if (doc || template) {
        return;
      }
      doc = currentDoc;
      template = tokenTemplate;
      document.registerElement(EL_NAME, {prototype: $Token.prototype});
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
  function require(path) {
    return $traceurRuntime.require("src/component/modules", path);
  }
  $__src_47_component_47_card__;
  $__src_47_component_47_token__;
  return {};
})();
var $__src_47_region_47_region__ = (function() {
  "use strict";
  var __moduleName = "src/region/region";
  function require(path) {
    return $traceurRuntime.require("src/region/region", path);
  }
  var DragDrop = ($__src_47_service_47_dragdrop__).default;
  var Utils = ($__src_47_utils__).default;
  var CLASS_OVER = 'over';
  function handleDragOver(event) {
    event.preventDefault();
    event.dropEffect = 'move';
  }
  function handleDragEnter(event) {
    event.preventDefault();
    this.classList.add(CLASS_OVER);
  }
  function handleDragLeave(event) {
    this.classList.remove(CLASS_OVER);
  }
  function handleDrop(event) {
    this.classList.remove(CLASS_OVER);
    this.appendChild(DragDrop.lastDraggedEl);
  }
  var Region = function Region() {};
  ($traceurRuntime.createClass)(Region, {
    createdCallback: function() {},
    attachedCallback: function() {
      this.addEventListener('dragover', handleDragOver);
      this.addEventListener('dragenter', handleDragEnter);
      this.addEventListener('dragleave', handleDragLeave);
      this.addEventListener('drop', handleDrop);
    }
  }, {}, HTMLElement);
  var $__default = Region;
  if (window.TEST_MODE) {
    Utils.makeGlobal('pb.region.Region', Region);
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_region_47_deck__ = (function() {
  "use strict";
  var __moduleName = "src/region/deck";
  function require(path) {
    return $traceurRuntime.require("src/region/deck", path);
  }
  var Region = ($__src_47_region_47_region__).default;
  var Utils = ($__src_47_utils__).default;
  var doc = null;
  var template = null;
  var EL_NAME = 'pb-r-deck';
  function handleClick(event) {
    if (event.which === 3) {
      this.shuffle();
    }
  }
  function handleContextMenu(event) {
    event.preventDefault();
    return false;
  }
  var Deck = function Deck() {
    $traceurRuntime.superConstructor($Deck).call(this);
  };
  var $Deck = Deck;
  ($traceurRuntime.createClass)(Deck, {
    createdCallback: function() {
      $traceurRuntime.superGet(this, $Deck.prototype, "createdCallback").call(this);
      var shadowRoot = this.createShadowRoot();
      shadowRoot.appendChild(Utils.activateTemplate(template, doc));
      this.addEventListener('mousedown', handleClick);
      this.addEventListener('contextmenu', handleContextMenu);
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
  Utils.makeGlobal('pb.region.Deck');
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_region_47_rect__ = (function() {
  "use strict";
  var __moduleName = "src/region/rect";
  function require(path) {
    return $traceurRuntime.require("src/region/rect", path);
  }
  var Region = ($__src_47_region_47_region__).default;
  var Utils = ($__src_47_utils__).default;
  var doc = null;
  var template = null;
  var EL_NAME = 'pb-r-rect';
  var Rect = function Rect() {
    $traceurRuntime.superConstructor($Rect).call(this);
  };
  var $Rect = Rect;
  ($traceurRuntime.createClass)(Rect, {createdCallback: function() {
      $traceurRuntime.superGet(this, $Rect.prototype, "createdCallback").call(this);
      var shadowRoot = this.createShadowRoot();
      shadowRoot.appendChild(Utils.activateTemplate(template, doc));
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
  function require(path) {
    return $traceurRuntime.require("src/region/modules", path);
  }
  $__src_47_region_47_deck__;
  $__src_47_region_47_rect__;
  return {};
})();
var $__src_47_service_47_modules__ = (function() {
  "use strict";
  var __moduleName = "src/service/modules";
  function require(path) {
    return $traceurRuntime.require("src/service/modules", path);
  }
  var DragDrop = ($__src_47_service_47_dragdrop__).default;
  return {};
})();
var $__src_47_surface_47_rectgrid__ = (function() {
  "use strict";
  var __moduleName = "src/surface/rectgrid";
  function require(path) {
    return $traceurRuntime.require("src/surface/rectgrid", path);
  }
  var As = ($__src_47_as__).default;
  var Utils = ($__src_47_utils__).default;
  var doc = null;
  var templates = null;
  var ATTR_ROW = 'row';
  var ATTR_COL = 'col';
  var EL_NAME = 'pb-s-rectgrid';
  var RectGrid = function RectGrid() {
    $traceurRuntime.superConstructor($RectGrid).apply(this, arguments);
  };
  var $RectGrid = RectGrid;
  ($traceurRuntime.createClass)(RectGrid, {
    createdCallback: function() {
      var shadowRoot = this.createShadowRoot();
      shadowRoot.appendChild(Utils.activateTemplate(templates.main, doc));
      var rowCount = As.int($(this).attr(ATTR_ROW));
      var colCount = As.int($(this).attr(ATTR_COL));
      var rootEl = shadowRoot.querySelector('#content');
      for (var row = 0; row < rowCount; row++) {
        rootEl.appendChild(Utils.activateTemplate(templates.row, doc));
      }
      $(shadowRoot.querySelectorAll('#content > div')).each((function(row, rowEl) {
        for (var col = 0; col < colCount; col++) {
          var colEl = Utils.activateTemplate(templates.col, doc);
          $(colEl.querySelector('content')).attr('select', ("[" + ATTR_ROW + "=\"" + row + "\"][" + ATTR_COL + "=\"" + col + "\"]")).attr('row', row).attr('col', col);
          rowEl.appendChild(colEl);
        }
      }));
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
    }}, HTMLElement);
  var $__default = RectGrid;
  Utils.makeGlobal('pb.surface.RectGrid', RectGrid);
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_surface_47_modules__ = (function() {
  "use strict";
  var __moduleName = "src/surface/modules";
  function require(path) {
    return $traceurRuntime.require("src/surface/modules", path);
  }
  $__src_47_surface_47_rectgrid__;
  return {};
})();
var $__src_47_modules__ = (function() {
  "use strict";
  var __moduleName = "src/modules";
  function require(path) {
    return $traceurRuntime.require("src/modules", path);
  }
  var Util = ($__src_47_utils__).default;
  $__src_47_component_47_modules__;
  $__src_47_region_47_modules__;
  $__src_47_service_47_modules__;
  $__src_47_surface_47_modules__;
  return {};
})();

//# sourceMappingURL=main.map
