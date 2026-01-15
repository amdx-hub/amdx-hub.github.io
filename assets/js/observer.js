document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll(
    '.fadeIn, .fadeInUp, .fadeInRight, .fadeInLeft'
  );

  if (!('IntersectionObserver' in window)) {
    // Fallback: sofort sichtbar
    animatedElements.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target); // nur einmal animieren
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px'
    }
  );

  animatedElements.forEach(el => observer.observe(el));
});