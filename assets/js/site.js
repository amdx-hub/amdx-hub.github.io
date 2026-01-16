document.addEventListener("DOMContentLoaded", function () {

  /* ==========================
     Variablen
  ========================== */
  const header = document.querySelector("nav");
  const ctaBtn = document.querySelector(".cta");
  const mobileList = document.querySelector(".mobile-list");
  const navIcon = document.querySelector(".nav--icon");
  const btns = document.querySelectorAll(".js-btn");
  const mobilebtns = document.querySelectorAll(".js-mobile-btn");

  /* ==========================
     Helper: Header Offset
  ========================== */
  function getHeaderOffset() {
    return header ? header.offsetHeight : 100;
  }

  /* ==========================
     Smooth Scroll (Desktop + Mobile)
  ========================== */
  function smoothScroll(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");

    if (!href || href.indexOf("#") === -1) return;

    const hash = href.split("#")[1];
    if (!hash) return;

    const targetEl = document.getElementById(hash);
    if (!targetEl) return;

    event.preventDefault();

    // Active State
    btns.forEach(l => l.classList.remove("selected"));
    mobilebtns.forEach(l => l.classList.remove("selected"));
    link.classList.add("selected");

    // Mobile Menü schließen
    if (mobileList && mobileList.classList.contains("show")) {
      mobileList.classList.remove("show");
      if (navIcon) navIcon.classList.remove("rotate");
      if (navIcon) navIcon.setAttribute("aria-expanded", "false");
      if (navIcon) navIcon.setAttribute("aria-label", "Open navigation");
    }

    // Smooth Scroll
    window.scrollTo({
      top: targetEl.offsetTop - getHeaderOffset(),
      behavior: "smooth"
    });

    // URL Hash ohne Sprung setzen
    history.pushState(null, "", "#" + hash);
  }

  btns.forEach(btn => btn.addEventListener("click", smoothScroll));
  mobilebtns.forEach(btn => btn.addEventListener("click", smoothScroll));

  /* ==========================
     Mobile Menü Toggle + ARIA
  ========================== */
  if (navIcon && mobileList) {
    navIcon.setAttribute("aria-expanded", "false");
    navIcon.setAttribute("aria-label", "Open navigation");
    navIcon.setAttribute("aria-controls", "mobile-menu");

    navIcon.addEventListener("click", function () {
      const isOpen = mobileList.classList.toggle("show");
      navIcon.classList.toggle("rotate");
      navIcon.setAttribute("aria-expanded", isOpen);
      navIcon.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
  }

  /* ==========================
     IntersectionObserver für Animationen
  ========================== */
  const animationClasses = ["fadeIn", "fadeInUp", "fadeInLeft", "fadeInRight"];
  const animatedElements = document.querySelectorAll(animationClasses.map(c => "." + c).join(","));

  if ("IntersectionObserver" in window && animatedElements.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          entry.target.style.transitionDelay = delay + "ms";
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px"
    });

    animatedElements.forEach(el => revealObserver.observe(el));
  }

  /* ==========================
     Sticky Navigation über .cta
  ========================== */
  if ("IntersectionObserver" in window && ctaBtn && header) {
    const navObserver = new IntersectionObserver(entries => {
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

  /* ==========================
     Tiny Slider Initialisierung
  ========================== */
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
});
