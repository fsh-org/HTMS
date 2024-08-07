// Stripped down version of https://github.com/bufferhead-code/nightowl
const css = document.createElement('style')
css.innerHTML = `html {
  /* Firefox fallback. */
  background-color: #111;
}
body {
  min-width: 100vh;
  min-width: 100dvh;
  filter: invert(100%) hue-rotate(180deg);
}
/* Do not invert media (revert the invert). */
img, video, iframe, .reverse {
  filter: invert(100%) hue-rotate(180deg);
}
/* Re-enable code block backgrounds. */
pre {
  filter: invert(6%);
}
/* Improve contrast on list item markers. */
li::marker {
  color: #666;
}`;
document.head.appendChild(css)
