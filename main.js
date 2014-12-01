var $__src_47_as__ = (function() {
  "use strict";
  var __moduleName = "src/as";
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
    }
  };
  var $__default = Utils = Utils;
  Utils.makeGlobal('pb.Utils', Utils);
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
var $__src_47_component_47_component__ = (function() {
  "use strict";
  var __moduleName = "src/component/component";
  var Utils = ($__src_47_utils__).default;
  var DragDropService = ($__src_47_service_47_dragdrop__).default;
  var PbElement = ($__src_47_pbelement__).default;
  var ATTR_DRAGGABLE = 'draggable';
  var CLASS_DRAGGED = 'pb-dragged';
  function setupDraggable() {
    var $__3 = this;
    var draggables = this.querySelectorAll('*[draggable="true"]');
    Utils.toArray(draggables).forEach(((function(draggable) {
      draggable.addEventListener('dragstart', handleDragStart.bind($__3));
      draggable.addEventListener('dragend', handleDragEnd.bind($__3));
    })).bind(this));
  }
  function handleDragEnd() {
    this.classList.remove(CLASS_DRAGGED);
  }
  function handleDragStart(event) {
    var dataTransfer = event.dataTransfer;
    dataTransfer.effectAllowed = 'move';
    this.classList.add(CLASS_DRAGGED);
    DragDropService.dragStart(this);
  }
  var Component = function Component() {};
  var $Component = Component;
  ($traceurRuntime.createClass)(Component, {
    createdCallback: function() {
      $traceurRuntime.superCall(this, $Component.prototype, "createdCallback", []);
    },
    config: function(config) {
      if (config.draggable) {
        setupDraggable.bind(this)();
      }
    }
  }, {}, PbElement);
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
  var As = ($__src_47_as__).default;
  var Component = ($__src_47_component_47_component__).default;
  var Utils = ($__src_47_utils__).default;
  var doc = null;
  var template = null;
  var EL_NAME = 'pb-c-card';
  var ATTR_SHOW_FRONT = 'pb-show-front';
  function handleClick() {
    var oldValue = As.boolean($(this).attr(ATTR_SHOW_FRONT) || 'false');
    $(this).attr(ATTR_SHOW_FRONT, !oldValue);
  }
  var Card = function Card() {
    $traceurRuntime.defaultSuperCall(this, $Card.prototype, arguments);
  };
  var $Card = Card;
  ($traceurRuntime.createClass)(Card, {
    createdCallback: function() {
      $traceurRuntime.superCall(this, $Card.prototype, "createdCallback", []);
      this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
      this.attachedCallback();
    },
    attachedCallback: function() {
      this.addEventListener('click', handleClick);
      this.config({draggable: true});
    },
    detachedCallback: function() {
      this.removeEventListener('click', handleClick);
    }
  }, {register: function(currentDoc, cardTemplate) {
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
  var Component = ($__src_47_component_47_component__).default;
  var Utils = ($__src_47_utils__).default;
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
  var Region = ($__src_47_region_47_region__).default;
  var Distribute = ($__src_47_service_47_distribute__).default;
  var Utils = ($__src_47_utils__).default;
  var doc = null;
  var template = null;
  var EL_NAME = 'pb-r-bag';
  function handleDistributeClick(event) {
    this.distribute();
    event.stopPropagation();
  }
  var Bag = function Bag() {
    $traceurRuntime.superCall(this, $Bag.prototype, "constructor", []);
  };
  var $Bag = Bag;
  ($traceurRuntime.createClass)(Bag, {
    createdCallback: function() {
      $traceurRuntime.superCall(this, $Bag.prototype, "createdCallback", []);
      this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
      this.shadowRoot.querySelector('#distribute').addEventListener('click', handleDistributeClick.bind(this));
    },
    distribute: function() {
      Distribute.begin(this);
    },
    next: function() {
      return this.children[0];
    }
  }, {register: function(currentDoc, bagTemplate) {
      if (doc || template) {
        return;
      }
      doc = currentDoc;
      template = bagTemplate;
      document.registerElement(EL_NAME, {prototype: $Bag.prototype});
    }}, Region);
  var $__default = Bag = Bag;
  Utils.makeGlobal('pb.region.Bag', Bag);
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
  $__src_47_region_47_bag__;
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
  var As = ($__src_47_as__).default;
  var Utils = ($__src_47_utils__).default;
  var PbElement = ($__src_47_pbelement__).default;
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
      var rowCount = As.int($(this).attr(ATTR_ROW));
      var colCount = As.int($(this).attr(ATTR_COL));
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
      console.log(this[$traceurRuntime.toProperty(_previewElHandler)]);
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
  var Utils = ($__src_47_utils__).default;
  var PbElement = ($__src_47_pbelement__).default;
  var As = ($__src_47_as__).default;
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
        for (var i = As.int(from); i < As.int(to); i += As.int(step)) {
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
  $__src_47_utils__;
  $__src_47_component_47_modules__;
  $__src_47_region_47_modules__;
  $__src_47_service_47_modules__;
  $__src_47_surface_47_modules__;
  $__src_47_ui_47_modules__;
  return {};
})();

//# sourceMappingURL=main.map
