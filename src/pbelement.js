import Utils from 'src/utils';

/**
 * Base class of all ProtoBoard elements.
 * 
 * @class PbElement
 * @extends HTMLElement
 */
export default class PbElement extends HTMLElement {

  /**
   * @constructor
   */
  constructor() {
    /**
     * True iff the element has been created.
     *
     * @type boolean
     * @property isCreated
     */
    this.isCreated = false;
  }

  createdCallback() {
    this.isCreated = false;
  }

  attachedCallback() {
    this.isCreated = true;
  }
}

Utils.makeGlobal('pb.PbElement', PbElement);
