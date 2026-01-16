document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     Variablen
  ===================================================== */
  const ctaBtn = document.querySelector(".cta");
  const mobileList = document.querySelector(".mobile-list");
  const navIcon = document.querySelector(".nav--icon");
  const header = document.querySelector("nav");

  const btns = document.querySelectorAll(".js-btn");
  const mobilebtns = document.querySelectorAll(".js-mobile-btn");

  // Alle Nav-Links zusammenfassen
  const allNavLinks = [...btns, ...mobilebtns];

  // Header-Offset berechnen, bei Resize anpassen
  let headerOffset = header ? header.offsetHeight : 100;
  window.addEventListener("resize", () => {
    headerOffset = header ? header.offsetHeight : 100;
  });

  /* =====================================================
     Tiny Slider Initialisierung (safe)
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
     Smooth Scroll
  ===================================================== */
  function smoothScroll(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");
    if (!href || href.indexOf("#") === -1) return;

    // Hash extrahieren (funktioniert auch bei absoluten URLs)
    const hash = new URL(href, window.location.href).hash.substring(1);
    if (!hash) return;

    const targetEl = document.getElementById(hash);
    if (!targetEl) return;

    event.preventDefault();

    // Active State (Desktop + Mobile)
    allNavLinks.forEach(l => l.classList.remove("selected"));
    link.classList.add("selected");

    // Mobile Menü schließen
    if (mobileList?.classList.contains("show")) {
      mobileList.classList.remove("show");
      navIcon?.classList.remove("rotate");
    }

    // Smooth Scroll
    window.scrollTo({
      top: targetEl.offsetTop - headerOffset,
      behavior: "smooth"
    });

    // URL Hash setzen ohne Sprung
    history.pushState(null, "", "#" + hash);
  }

  // Event Listener für alle Nav Links
  allNavLinks.forEach(link => link.addEventListener("click", smoothScroll));

  /* =====================================================
     Intersection Observer – Scroll Animation (einmalig)
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
          observer.unobserve(entry.target); // nur einmal animieren
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
  if ("IntersectionObserver" in window && ctaBtn && header) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        header.classList.toggle("fixed", !entry.isIntersecting);
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
