document.addEventListener("DOMContentLoaded", function () {

  /* =====================================================
     Variablen
  ===================================================== */

  var ctaBtn = document.querySelector(".cta");
  var mobileList = document.querySelector(".mobile-list");
  var navIcon = document.querySelector(".nav--icon");
  var btns = document.querySelectorAll(".js-btn");
  var mobilebtns = document.querySelectorAll(".js-mobile-btn");
  var sections = document.querySelectorAll(".js-section");
  var header = document.querySelector("nav"); // für Offset

  /* =====================================================
     Tiny Slider – Initialisierung
  ===================================================== */

  if (typeof tns === "function") {
    tns({
      container: ".slide__container",
      arrowKeys: true,
      controlsText: [
        '<i class="fas fa-angle-left"></i>',
        '<i class="fas fa-angle-right"></i>'
      ],
      nav: false
    });
  }

  /* =====================================================
     Smooth Scroll
  ===================================================== */

  function getHeaderOffset() {
    return header ? header.offsetHeight : 100;
  }

  function smoothScroll(event) {
    var link = event.currentTarget;
    var href = link.getAttribute("href");

    // Nur Hash-Links
    if (!href || href.indexOf("#") === -1) return;

    var targetId = href.split("#")[1];
    var targetEl = document.getElementById(targetId);

    if (!targetEl) return;

    event.preventDefault();

    // Active State (Desktop + Mobile)
    btns.forEach(function (l) { l.classList.remove("selected"); });
    mobilebtns.forEach(function (l) { l.classList.remove("selected"); });

    link.classList.add("selected");

    // Mobile Menu schließen
    if (mobileList && mobileList.classList.contains("show")) {
      mobileList.classList.remove("show");
      navIcon.classList.remove("rotate");
    }

    window.scrollTo({
      top: targetEl.offsetTop - getHeaderOffset(),
      behavior: "smooth"
    });

    // URL Hash aktualisieren ohne Sprung
    history.pushState(null, "", "#" + targetId);
  }

  // Event Listener binden
  btns.forEach(function (btn) {
    btn.addEventListener("click", smoothScroll);
  });
  mobilebtns.forEach(function (btn) {
    btn.addEventListener("click", smoothScroll);
  });

  /* =====================================================
     Intersection Observer – Scroll Animation (einmalig)
  ===================================================== */

  var animationClasses = ["fadeIn", "fadeInUp", "fadeInLeft", "fadeInRight"];

  function buildSelector(classes) {
    return classes.map(function (cls) { return "." + cls; }).join(",");
  }

  var animatedElements = document.querySelectorAll(buildSelector(animationClasses));

  if ("IntersectionObserver" in window && animatedElements.length) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.dataset.delay || 0;
          entry.target.style.transitionDelay = delay + "ms";
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target); // nur einmal
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px"
    });

    animatedElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* =====================================================
     Navigation – Sticky beim Scroll
  ===================================================== */

  if ("IntersectionObserver" in window && ctaBtn) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
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

  if (navIcon) {
    navIcon.addEventListener("click", function () {
      if (mobileList) {
        mobileList.classList.toggle("show");
      }
      navIcon.classList.toggle("rotate");
    });
  }

});
