(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = (!stored || stored === "system") ? "dark" : stored;
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
