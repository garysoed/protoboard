import Region from 'src/region/region';
import Utils from 'src/utils';

let doc = null;
let template = null;

const EL_NAME = 'pb-r-rect';

class Rect extends Region {
  constructor() {
    super();
  }

  createdCallback() {
    super.createdCallback();
    this.createShadowRoot().appendChild(Utils.activateTemplate(template, doc));
  }

  static register(currentDoc, rectTemplate) {
    if (doc || template) {
      // Registration has already happened.
      return;
    }

    doc = currentDoc;
    template = rectTemplate;
    document.registerElement(EL_NAME,  {prototype: Rect.prototype});
  }
}

export default Rect = Rect;

Utils.makeGlobal('pb.region.Rect', Rect);
