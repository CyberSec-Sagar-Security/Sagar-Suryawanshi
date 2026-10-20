/**
 * theme-init.js — must be loaded synchronously (no defer) in <head>
 * Applies the saved theme class to <html> before first paint to prevent flash.
 * Default theme: follows the visitor's system appearance; the toggle overrides it.
 */
(function () {
  var saved = null;
  try { saved = localStorage.getItem('portfolio-theme'); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = saved === 'dark' || saved === 'light' ? saved : (prefersDark ? 'dark' : 'light');
  document.documentElement.classList.add(theme);
}());
