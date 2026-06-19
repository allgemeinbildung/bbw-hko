(function () {
  // Event delegation for open / close — works with dynamically rendered buttons (React etc.)
  document.addEventListener('click', function (e) {
    var openBtn = e.target.closest('[data-modal-open]');
    if (openBtn) {
      var dlg = document.getElementById(openBtn.getAttribute('data-modal-open'));
      if (dlg) dlg.showModal();
      return;
    }
    var closeBtn = e.target.closest('[data-modal-close]');
    if (closeBtn) {
      var dlg2 = document.getElementById(closeBtn.getAttribute('data-modal-close'));
      if (dlg2) dlg2.close();
      return;
    }
    // click on backdrop area of a <dialog>
    if (e.target.tagName === 'DIALOG') e.target.close();
  });

  // Fetch modal fragments and inject them into a portal div at the end of <body>
  window.loadModals = function (names) {
    var portal = document.createElement('div');
    portal.id = 'modals-portal';
    document.body.appendChild(portal);
    names.forEach(function (name) {
      fetch('/modals/' + name + '.html')
        .then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (html) { if (html) portal.insertAdjacentHTML('beforeend', html); })
        .catch(function () {});
    });
  };
})();
