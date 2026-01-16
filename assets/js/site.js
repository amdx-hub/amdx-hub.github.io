/* ================================
   Navigation & Mobile Menu
================================ */

var btns = document.querySelectorAll(".js-btn");
var mobileBtns = document.querySelectorAll(".js-mobile-btn");
var mobileList = document.querySelector(".mobile-list");
var navIcon = document.querySelector(".nav--icon");

/* ================================
   Smooth Scroll (data-target)
================================ */

function smoothScroll(event) {
  event.preventDefault();

  var targetId = event.currentTarget.dataset.target;
  var targetEl = document.getElementById(targetId);

  if (!targetEl) return;

  // Active State entfernen
  document
    .querySelectorAll(".js-btn, .js-mobile-btn")
    .forEach(function (btn) {
      btn.classList.remove("selected");
    });

  // Aktives Element setzen
  event.currentTarget.classList.add("selected");

  // Mobile Nav schließen
  if (mobileList && mobileList.classList.contains("show")) {
    mobileList.classList.remove("show");
  }

  window.scrollTo({
    top: targetEl.offsetTop - 100,
    behavior: "smooth"
  });
}

/* ================================
   Event Binding Navigation
================================ */

btns.forEach(function (btn) {
  btn.addEventListener("click", smoothScroll);
});

mobileBtns.forEach(function (btn) {
  btn.addEventListener("click", smoothScroll);
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

      // Animation nur einmal ausführen
      obs.unobserve(entry.target);
    });
  },
  {
    threshold: 0.2
  }
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
