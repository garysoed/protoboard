pb.Utils.makeGlobal('pb.t', {
  createFakeAbility: function(name) {
    var _ = spies.Spies;
    return { 
      name: name, 
      trigger: _.spiedFunction(),
      setDefaultValue: _.spiedFunction(),
      attributeChangedCallback: _.spiedFunction(),
      attachedCallback: _.spiedFunction(),
      detachedCallback: _.spiedFunction()
    };
  }
});