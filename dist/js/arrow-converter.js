// Convert -[label]-> to visual arrows
function convertArrows() {
  const slides = document.querySelectorAll('.reveal .slides');
  slides.forEach(slide => {
    const textNodes = getTextNodes(slide);
    textNodes.forEach(node => {
      const arrowPattern = /-\[(.*?)\]->/g;
      if (arrowPattern.test(node.textContent)) {
        const parent = node.parentNode;
        const wrapper = document.createElement('span');
        wrapper.innerHTML = node.textContent.replace(arrowPattern, 
          '<span style="display: inline-flex; align-items: center; margin: 0 0.3rem;">' +
          '  <span style="font-size: 1.2rem; color: #0d5be9;">—</span>' +
          '  <span style="background: #0d5be9; color: white; padding: 0 0.2rem; border-radius: 0.2rem; font-size: 0.6rem;">$1</span>' +
          '  <span style="font-size: 1.2rem; color: #0d5be9;">→</span>' +
          '</span>'
        );
        parent.replaceChild(wrapper, node);
      }
    });
  });
}

function getTextNodes(element) {
  const textNodes = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  let node;
  while (node = walker.nextNode()) {
    if (node.textContent.trim()) {
      textNodes.push(node);
    }
  }
  return textNodes;
}

// Auto-initialize when Reveal.js is ready
if (typeof Reveal !== 'undefined') {
  Reveal.on('ready', convertArrows);
} else {
  // Fallback if Reveal is not yet loaded
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof Reveal !== 'undefined') {
      Reveal.on('ready', convertArrows);
    }
  });
}