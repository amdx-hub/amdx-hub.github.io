document.addEventListener("DOMContentLoaded", function () {

  /* =====================================================
     Konfiguration
     ===================================================== */

  // Alle Animationsklassen, die beobachtet werden sollen
  var animationClasses = [
    "fadeIn",
    "fadeInUp",
    "fadeInLeft",
    "fadeInRight"
  ];

  /* =====================================================
     Hilfsfunktion: Selektor bauen
     ===================================================== */

  function buildSelector(classes) {
    return classes.map(function (cls) {
      return "." + cls;
    }).join(",");
  }

  var animatedElements = document.querySelectorAll(
    buildSelector(animationClasses)
  );

  /* =====================================================
     Intersection Observer – Scroll Reveal (ONCE)
     ===================================================== */

  if ("IntersectionObserver" in window && animatedElements.length) {

    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target); // ✅ nur einmal
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    animatedElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* =====================================================
     📌 Fixed Navigation (unverändert, falls vorhanden)
     ===================================================== */

  var ctaBtn = document.querySelector(".cta");

  if ("IntersectionObserver" in window && ctaBtn) {
    var nav = document.querySelector("nav");

    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            nav.classList.add("fixed");
          } else {
            nav.classList.remove("fixed");
          }
        });
      },
      {
        rootMargin: "-80px 0px 0px 0px",
        threshold: 0
      }
    );

    navObserver.observe(ctaBtn);
  }

});
