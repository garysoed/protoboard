(function(document) {
  var sinceEl = document.querySelector('.main-header-section .since');
  var headerEl = document.querySelector('.main-header');
  var mainEl = document.querySelector('.main-main');
  mainEl.addEventListener('scroll', function() {
    if (mainEl.scrollTop <= 0) {
      headerEl.classList.add('scroll-top');
    } else {
      headerEl.classList.remove('scroll-top');
    }

    var maxScroll = mainEl.scrollHeight - mainEl.clientHeight;
    var ratio = Math.max(0, 1 - mainEl.scrollTop / maxScroll * 3);
    sinceEl.style.height = ratio * 25 + 'px';

    var padding = (1 + 1 * ratio) + 'em';
    headerEl.style.paddingTop = padding;
    headerEl.style.paddingBottom = padding;
  });

  document.querySelector('.main-menu-button').addEventListener('click', function() {
    document.querySelector('section.main-content').classList.toggle('expand');
  });
})(document);
