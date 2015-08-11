(function(document) {
  // Scrolls the selected page in the tab into view, and collapse all the other headers.
  var selected = document.querySelector('.sidebar-selected');
  if (selected) {
    selected.scrollIntoView();
    var unselectedSections =
        document.querySelectorAll('.sidebar section.collapsible:not(.selected)');
    for (var i = 0; i < unselectedSections.length; i++) {
      var unselectedSection = unselectedSections.item(i);
      unselectedSection.classList.toggle('collapsed', true);
    }
  }
})(document);
