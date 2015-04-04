import BindingTree from './bindingtree';
import Globals from './globals';
import Provider from './provider';
import Scope from './scope';

((window) => {
  window['DI'] = new Scope();

  window['DI']['BindingTree'] = BindingTree;
  window['DI']['Provider'] = Provider;
  window['DI']['Scope'] = Scope;
  window['DI']['bindings'] = Globals.bindings;
})(window);