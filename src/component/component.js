import Utils from 'src/utils';
import PbElement from 'src/pbelement';

/**
 * Base class for all components.
 *
 * @class component.Component
 * @extends PbElement  
 */
export default class Component extends PbElement {

  /**
   * For testing only.
   */
  constructor() { }

  createdCallback() {
    super.createdCallback();
  }
}

if (window.TEST_MODE) {
  Utils.makeGlobal('pb.component.Component', Component);
}
