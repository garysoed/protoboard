import Utils from 'src/utils';

/**
 * Base class of all ProtoBoard elements.
 * 
 * @class PbElement
 * @extends HTMLElement
 */
export default class PbElement extends HTMLElement {

  createdCallback() {
    /**
     * True iff the element has been created and attached.
     *
     * @type boolean
     * @property isCreated
     */
    this.isCreated = false;
  }

  attachedCallback() {
    this.isCreated = true;
  }

  detachedCallback() { }
}

Utils.makeGlobal('pb.PbElement', PbElement);
