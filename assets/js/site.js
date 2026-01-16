document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     Variablen
  ===================================================== */
  const header = document.querySelector("nav");
  const ctaBtn = document.querySelector(".cta");
  const navIcon = document.querySelector(".nav--icon");
  const mobileList = document.querySelector(".mobile-list");
  const allNavLinks = [...document.querySelectorAll(".js-btn, .js-mobile-btn")];

  let headerOffset = header ? header.offsetHeight : 100;

  // Header Offset bei Resize anpassen
  window.addEventListener("resize", () => {
    headerOffset = header ? header.offsetHeight : 100;
  });

  /* =====================================================
     Tiny Slider Initialisierung (sicher)
  ===================================================== */
  if (typeof tns === "function") {
    const sliderContainer = document.querySelector(".slide__container");
    if (sliderContainer) {
      tns({
        container: sliderContainer,
        arrowKeys: true,
        controlsText: [
          '<i class="fas fa-angle-left"></i>',
          '<i class="fas fa-angle-right"></i>'
        ],
        nav: false
      });
    }
  }

  /* =====================================================
     Smooth Scroll Funktion
  ===================================================== */
  function smoothScroll(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");
    if (!href || !href.includes("#")) return;

    const url = new URL(href, window.location.href);
    const targetHash = url.hash.substring(1);
    if (!targetHash) return;

    event.preventDefault();

    // Seitenwechsel erkennen
    if (url.pathname !== window.location.pathname) {
      window.location.href = url.href;
      return;
    }

    // Scrollen auf gleiche Seite
    const targetEl = document.getElementById(targetHash);
    if (!targetEl) return;

    window.scrollTo({
      top: targetEl.offsetTop - headerOffset,
      behavior: "smooth"
    });

    // Active State
    allNavLinks.forEach(l => l.classList.remove("selected"));
    link.classList.add("selected");

    // Mobile Menü schließen
    if (mobileList?.classList.contains("show")) {
      mobileList.classList.remove("show");
      navIcon?.classList.remove("rotate");
    }

    // URL Hash setzen ohne Sprung
    history.pushState(null, "", "#" + targetHash);
  }

  allNavLinks.forEach(link => link.addEventListener("click", smoothScroll));

  // Seitenübergreifender Smooth Scroll beim Laden prüfen
  if (window.location.hash) {
    const targetEl = document.getElementById(window.location.hash.substring(1));
    if (targetEl) {
      setTimeout(() => {
        window.scrollTo({
          top: targetEl.offsetTop - headerOffset,
          behavior: "smooth"
        });
      }, 50);
    }
  }

  /* =====================================================
     Intersection Observer – Animationen (einmalig)
  ===================================================== */
  const animationClasses = ["fadeIn", "fadeInUp", "fadeInLeft", "fadeInRight"];
  const animatedElements = document.querySelectorAll(animationClasses.map(c => "." + c).join(","));

  if ("IntersectionObserver" in window && animatedElements.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          entry.target.style.transitionDelay = delay + "ms";
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target); // nur einmal
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px"
    });

    animatedElements.forEach(el => revealObserver.observe(el));
  }

  /* =====================================================
     Sticky Navigation beim Scroll über .cta
  ===================================================== */
  if ("IntersectionObserver" in window && ctaBtn) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          header.classList.add("fixed");
        } else {
          header.classList.remove("fixed");
        }
      });
    }, {
      rootMargin: "-80px 0px 0px 0px",
      threshold: 0
    });

    navObserver.observe(ctaBtn);
  }

  /* =====================================================
     Mobile Navigation Toggle
  ===================================================== */
  navIcon?.addEventListener("click", () => {
    mobileList?.classList.toggle("show");
    navIcon.classList.toggle("rotate");
  });

});
