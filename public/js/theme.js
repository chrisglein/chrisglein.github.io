(function () {
  var select = document.getElementById('theme-select');
  if (!select) return;

  select.value = document.documentElement.dataset.theme || 'auto';
  select.addEventListener('change', function () {
    var theme = select.value;
    if (theme === 'auto') {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = theme;
    }
    try {
      if (theme === 'auto') localStorage.removeItem('theme');
      else localStorage.setItem('theme', theme);
    } catch (e) {
      // The current page still reflects the selection when storage is unavailable.
    }
  });
}());
