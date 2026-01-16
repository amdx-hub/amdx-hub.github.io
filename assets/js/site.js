/* ================================
   DOM References
================================ */

var navLinks = document.querySelectorAll(".js-btn");
var navIcon = document.querySelector(".nav--icon");
var mobileList = document.querySelector(".mobile-list");
var header = document.querySelector("nav");

/* ================================
   Helpers
================================ */

function getHeaderOffset() {
  return header ? header.offsetHeight : 100;
}

/* ================================
   Smooth Scroll (href="#section-id")
================================ */

function smoothScroll(event) {
  var link = event.currentTarget;
  var href = link.getAttribute("href");

  // Nur Hash-Links abfangen
  if (!href || href.indexOf("#") === -1) return;

  var targetId = href.split("#")[1];
  var targetEl = document.getElementById(targetId);

  if (!targetEl) return;

  event.preventDefault();

  // Active State
  navLinks.forEach(function (l) {
    l.classList.remove("selected");
  });

  link.classList.add("selected");

  // Mobile Nav schließen
  if (mobileList && mobileList.classList.contains("show")) {
    mobileList.classList.remove("show");
  }

  window.scrollTo({
    top: targetEl.offsetTop - getHeaderOffset(),
    behavior: "smooth"
  });

  // URL Hash ohne Sprung setzen
  history.pushState(null, "", "#" + targetId);
}

/* ================================
   Bind Navigation Events
================================ */

navLinks.forEach(function (link) {
  link.addEventListener("click", smoothScroll);
});

/* ================================
   Intersection Observer Animations
   (nur einmal)
================================ */

var animatedElements = document.querySelectorAll(
  ".fadeIn, .fadeInUp, .fadeInLeft, .fadeInRight"
);

if ("IntersectionObserver" in window) {
  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var delay = entry.target.dataset.delay || 0;
        entry.target.style.transitionDelay = delay + "ms";
        entry.target.classList.add("is-visible");

        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  animatedElements.forEach(function (el) {
    observer.observe(el);
  });
} else {
  // Fallback
  animatedElements.forEach(function (el) {
    el.classList.add("is-visible");
  });
}

/* ================================
   Mobile Navigation Toggle
================================ */

if (navIcon) {
  navIcon.addEventListener("click", function () {
    if (mobileList) {
      mobileList.classList.toggle("show");
    }
    navIcon.classList.toggle("rotate");
  });
}

/* ================================
   Tiny Slider Init (SAFE)
================================ */

document.addEventListener("DOMContentLoaded", function () {
  var sliderContainer = document.querySelector(".slide__container");

  if (sliderContainer && typeof tns === "function") {
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
});
