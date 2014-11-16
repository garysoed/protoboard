import Utils from 'src/utils';

export default class PbElement extends HTMLElement {
  createdCallback() {
    this.isCreated = false;
  }

  attachedCallback() {
    this.isCreated = true;
  }
}

Utils.makeGlobal('pb.PbElement', PbElement);
