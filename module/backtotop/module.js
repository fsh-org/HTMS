if (!document.getElementsByTagName('btt')[0]) {
  document.body.appendChild(document.createElement('btt'))
}
let b = document.getElementsByTagName('btt')[0];
b.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="34" height="34" viewBox="0,0,320,352"><g transform="translate(-80,-4)"><g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill="${b.getAttribute('color') || '#fff'}" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal"><path d="M89.9,138.1l122.8,-122.8c7.2,-7.2 17.1,-11.3 27.3,-11.3c10.2,0 20.1,4.1 27.3,11.3l122.8,122.8c6.4,6.4 9.9,15 9.9,24c0,18.7 -15.2,33.9 -33.9,33.9l-62.1,0l0,128c0,17.7 -14.3,32 -32,32h-64c-17.7,0 -32,-14.3 -32,-32l0,-128h-62.1c-18.7,0 -33.9,-15.2 -33.9,-33.9c0,-9 3.6,-17.6 9.9,-24z"/></g></g></svg>`;
b.style.display = "flex";
b.style.position = "fixed";
b.style.bottom = "5px";
b.style[b.getAttribute('place') || "right"] = "5px";
b.style.background = b.getAttribute('background') || "#88f";
b.style.border = b.getAttribute('border') || "none";
b.style.borderRadius = b.getAttribute('radius') || "0.5rem";
b.style.width = "40px";
b.style.height = "40px";
b.style.alignItems = "center";
b.style.justifyContent = "center";
b.style.cursor = "auto";
b.style.transition = "opacity 500ms ease-in";
b.style.opacity = "0";

window.onscroll = function() {
  var scrolled = window.scrollY;
  if (scrolled > window.innerHeight) {
    b.style.opacity = "1"
    b.style.cursor = "pointer";
  } else {
    b.style.opacity = "0"
    b.style.cursor = "auto";
  }
};

b.onclick = function() {
  if (b.style.opacity == "0") return;
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
