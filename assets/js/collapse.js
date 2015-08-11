(function(document) {
  // Add the collapse / uncollapse logic.
  function setCollapsibleHeight(contentEl, sectionEl, contentHeight) {
    contentEl.style.height = sectionEl.classList.contains('collapsed') ? '0' : contentHeight
  }

  var isMobile = false;
  var rootEl = isMobile ? document.querySelector('.main-main') : document;
  var els = rootEl.querySelectorAll('section.collapsible');
  for (var i = 0; i < els.length; i++) {
    var section = els.item(i);
    var content = section.querySelector('div');
    var header = section.querySelector('header');
    var height = content.clientHeight + 'px';

    // Initialize the height.
    setCollapsibleHeight(content, section, height);

    header.addEventListener('click', function(section, content, contentHeight, setHeight) {
      section.classList.toggle('collapsed');
      setCollapsibleHeight(content, section, contentHeight);
      content.style.height = section.classList.contains('collapsed') ? '0' : contentHeight;
    }.bind(header, section, content, height));
  }
})(document);
