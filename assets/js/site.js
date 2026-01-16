/* ================================
   Navigation & Mobile Menu
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
   Smooth Scroll via href="#id"
================================ */

function smoothScroll(event) {
  var href = event.currentTarget.getAttribute("href");

  // Nur interne Hash-Links abfangen
  if (!href || href.indexOf("#") === -1) return;

  var targetId = href.split("#")[1];
  var targetEl = document.getElementById(targetId);

  if (!targetEl) return;

  event.preventDefault();

  // Active State
  navLinks.forEach(function (link) {
    link.classList.remove("selected");
  });

  event.currentTarget.classList.add("selected");

  // Mobile Nav schließen
  if (mobileList && mobileList.classList.contains("show")) {
    mobileList.classList.remove("show");
  }

  window.scrollTo({
    top: targetEl.offsetTop - getHeaderOffset(),
    behavior: "smooth"
  });

  // URL Hash aktualisieren ohne Sprung
  history.pushState(null, "", "#" + targetId);
}

/* ================================
   Event Binding Navigation
================================ */

navLinks.forEach(function (link) {
  link.addEventListener("click", smoothScroll);
});

/* ================================
   Intersection Observer Animations
================================ */

var animatedElements = document.querySelectorAll(
  ".fadeIn, .fadeInUp, .fadeInLeft, .fadeInRight"
);

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
