/**
 * theme-init.js — must be loaded synchronously (no defer) in <head>
 * Applies the saved theme class to <html> before first paint to prevent flash.
 * Default theme: light
 */
(function () {
  var saved = localStorage.getItem('portfolio-theme');
  if (saved === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.add('light');
  }
}());
