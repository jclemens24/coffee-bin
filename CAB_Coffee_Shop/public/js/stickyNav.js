export const handleHover = function (e) {
  if (e.target.classList.contains('nav_link')) {
    const link = e.target;
    const siblings = link.closest('.nav_links').querySelectorAll('.nav_link');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
  }
};
