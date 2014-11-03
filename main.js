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
      Object.observe(object, function(changes) {
        changes.forEach((function(change) {
          if (!property || change.name === property) {
            handler(change.name, change.type, change.oldValue);
          }
        }));
      });
    },
    getContentElementRoot: function(el) {
      return el.querySelectorAll(':not(style):not(script)');
    }
  };
  var $__default = Utils = Utils;
  if (!window.pb) {
    window.pb = {};
  }
  window.pb.Utils = Utils;
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_component_47_component__ = (function() {
  "use strict";
  var __moduleName = "src/component/component";
  var Utils = ($__src_47_utils__).default;
  var ATTR_DRAGGABLE = 'draggable';
  function setupDraggable() {
    var rootEl = this.shadowRoot.querySelector('#root');
    $(rootEl).attr('draggable', 'true');
    rootEl.addEventListener('dragstart', handleDragStart);
  }
  function handleDragStart(event) {
    var dataTransfer = event.dataTransfer;
    dataTransfer.setData('text/html', this);
    dataTransfer.effectAllowed = 'move';
  }
  var Component = function Component() {};
  ($traceurRuntime.createClass)(Component, {attachedCallback: function() {
      if (this.hasAttribute(ATTR_DRAGGABLE)) {
        setupDraggable.bind(this)();
      }
    }}, {}, HTMLElement);
  var $__default = Component;
  if (window.TEST_MODE) {
    if (!window.pb) {
      window.pb = {};
    }
    window.pb.Component = Component;
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_component_47_token__ = (function() {
  "use strict";
  var __moduleName = "src/component/token";
  var Component = ($__src_47_component_47_component__).default;
  return {};
})();
var $__src_47_component_47_modules__ = (function() {
  "use strict";
  var __moduleName = "src/component/modules";
  $__src_47_component_47_token__;
  return {};
})();
var $__src_47_region_47_Region__ = (function() {
  "use strict";
  var __moduleName = "src/region/Region";
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
  var Region = function Region() {};
  ($traceurRuntime.createClass)(Region, {
    createdCallback: function() {},
    attachedCallback: function() {
      this.addEventListener('dragover', handleDragOver);
      this.addEventListener('dragenter', handleDragEnter);
      this.addEventListener('dragleave', handleDragLeave);
    }
  }, {}, HTMLElement);
  var $__default = Region;
  if (window.TEST_MODE) {
    if (!window.pb) {
      window.pb = {};
    }
    window.pb.Region = Region;
  }
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_region_47_rect__ = (function() {
  "use strict";
  var __moduleName = "src/region/rect";
  var Region = ($__src_47_region_47_Region__).default;
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
  if (!window.pb) {
    window.pb = {};
  }
  window.pb.Rect = Rect;
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_region_47_modules__ = (function() {
  "use strict";
  var __moduleName = "src/region/modules";
  $__src_47_region_47_rect__;
  return {};
})();
var $__src_47_service_47_dragdrop__ = (function() {
  "use strict";
  var __moduleName = "src/service/dragdrop";
  var DragDrop = {
    EventType: {DRAGGED: 'dragged'},
    lastDraggedEl: null,
    dragStart: function(draggedEl) {
      this.lastDraggedEl = draggedEl;
      $(this).trigger(this.EventType.DRAGGED, draggedEl);
    }
  };
  var $__default = DragDrop = DragDrop;
  if (!window.pb) {
    window.pb = {};
  }
  window.pb.DragDrop = DragDrop;
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_service_47_modules__ = (function() {
  "use strict";
  var __moduleName = "src/service/modules";
  var DragDrop = ($__src_47_service_47_dragdrop__).default;
  return {};
})();
var $__src_47_as__ = (function() {
  "use strict";
  var __moduleName = "src/as";
  var As = {int: function(input) {
      var radix = arguments[1] !== (void 0) ? arguments[1] : 10;
      var output = Number.parseInt(input, radix);
      if (Number.isNaN(output)) {
        throw (input + " is not an integer with radix " + radix);
      }
      return output;
    }};
  var $__default = As = As;
  if (!window.pb) {
    window.pb = {};
  }
  window.pb.As = As;
  return {get default() {
      return $__default;
    }};
})();
var $__src_47_surface_47_rectgrid__ = (function() {
  "use strict";
  var __moduleName = "src/surface/rectgrid";
  var As = ($__src_47_as__).default;
  var Utils = ($__src_47_utils__).default;
  var doc = null;
  var templates = null;
  var ATTR_ROW = 'row';
  var ATTR_COL = 'col';
  var EL_NAME = 'pb-s-rectgrid';
  var RectGrid = function RectGrid() {
    $traceurRuntime.defaultSuperCall(this, $RectGrid.prototype, arguments);
  };
  var $RectGrid = RectGrid;
  ($traceurRuntime.createClass)(RectGrid, {
    createdCallback: function() {
      var shadowRoot = this.createShadowRoot();
      shadowRoot.appendChild(Utils.activateTemplate(templates.main, doc));
      var rowCount = As.int($(this).attr(ATTR_ROW));
      var colCount = As.int($(this).attr(ATTR_COL));
      var rootEl = shadowRoot.querySelector('#root');
      for (var row = 0; row < rowCount; row++) {
        rootEl.appendChild(Utils.activateTemplate(templates.row, doc));
      }
      $(shadowRoot.querySelectorAll('#root > div')).each((function(row, rowEl) {
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
  if (!window.pb) {
    window.pb = {};
  }
  window.pb.RectGrid = RectGrid;
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
var $__src_47_modules__ = (function() {
  "use strict";
  var __moduleName = "src/modules";
  var Util = ($__src_47_utils__).default;
  $__src_47_component_47_modules__;
  $__src_47_region_47_modules__;
  $__src_47_service_47_modules__;
  $__src_47_surface_47_modules__;
  return {};
})();

//# sourceMappingURL=main.map
