import BindingTree from './bindingtree';

const Globals = {
  get: Symbol('get'),

  getGlobal(key, scope) {
    let globalProvider = this.bindings.get(key);
    if (globalProvider === undefined) {
      return undefined;
    } else {
      return globalProvider.resolve(scope);
    }
  },

  bindings: new BindingTree()
};

export default Globals;