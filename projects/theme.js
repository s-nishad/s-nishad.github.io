(function () {
  try {
    var stored = localStorage.getItem("theme");
    var systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = (!stored || stored === "system") ? (systemDark ? "dark" : "light") : stored;
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
