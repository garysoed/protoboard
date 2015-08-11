(function(document, window) {
  // Override the anchors
  var parser = new DOMParser();
  var xhrTarget = document.querySelector('.main-main');

  var sectionEls = document.querySelectorAll('.sidebar section');
  for (var i = 0; i < sectionEls.length; i++) {
    var sectionEl = sectionEls.item(i);
    var sectionHeader = sectionEl.querySelector('header h2');
    var sidebarListItems = sectionEl.querySelectorAll('li');
    for (var j = 0; j < sidebarListItems.length; j++) {
      var sidebarListItem = sidebarListItems.item(j);
      var sidebarLink = sidebarListItem.querySelector('a');
      sidebarLink.addEventListener('click', function(section, sectionHeader, listItem, event) {
        // Update the history.
        history.pushState({}, '', this.href);

        // Removes any selected CSS elements
        var selectedSection = document.querySelector('.sidebar section.collapsible.selected');
        if (selectedSection) {
          selectedSection.classList.toggle('selected', false);
        }

        var selectedListItem = document.querySelector('.sidebar li.sidebar-selected');
        if (selectedListItem) {
          selectedListItem.classList.toggle('sidebar-selected', false);
        }

        var primaryHeader = document.querySelector('.sidebar header h2.button.primary');
        if (primaryHeader) {
          primaryHeader.classList.toggle('primary', false);
        }

        var primaryLink = document.querySelector('.sidebar a.primary');
        if (primaryLink) {
          primaryLink.classList.toggle('primary', false);
        }

        // Selects the link
        listItem.classList.toggle('sidebar-selected', true);
        section.classList.toggle('selected', true);
        sectionHeader.classList.toggle('primary', true);
        this.classList.toggle('primary', true);

        // Grabs the page
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (4 != xhr.readyState) {
            return;
          }
          if (200 != xhr.status) {
            return;
          }

          xhrTarget.innerHTML = parser
              .parseFromString(xhr.responseText, 'text/html')
              .querySelector('.main-main')
              .innerHTML;
          xhrTarget.scrollTop = 0;

          prettyPrint();
        };
        xhr.open('GET', this.href);
        xhr.send();
        event.preventDefault();
      }.bind(sidebarLink, sectionEl, sectionHeader, sidebarListItem));
    }
  }
})(document, window);
