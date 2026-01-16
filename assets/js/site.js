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

  /* =====================================================
     Slider
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
     Navigation – Smooth Scroll
     ===================================================== */

  function setActiveLink(event, buttons) {
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("selected");
    }
    event.target.classList.add("selected");
  }

  function smoothScrollTo(i, buttons, event) {
    var element = sections[i - 1] || sections[i - 8];
    setActiveLink(event, buttons);

    if (mobileList.classList.contains("show")) {
      mobileList.classList.remove("show");
    }

    window.scrollTo({
      behavior: "smooth",
      top: element ? element.offsetTop - 100 : 0,
      left: 0
    });
  }

  if (btns.length && sections.length) {
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", smoothScrollTo.bind(this, i, btns));
    }
  }

  if (mobilebtns.length && sections.length) {
    for (var i = 0; i < mobilebtns.length; i++) {
      mobilebtns[i].addEventListener(
        "click",
        smoothScrollTo.bind(this, i, mobilebtns)
      );
    }
  }

  /* =====================================================
     🔥 Intersection Observer – Scroll Animation (ONCE)
     ===================================================== */

  var animationClasses = [
    "fadeIn",
    "fadeInUp",
    "fadeInLeft",
    "fadeInRight"
  ];

  function buildSelector(classes) {
    return classes.map(function (cls) {
      return "." + cls;
    }).join(",");
  }

  var animatedElements = document.querySelectorAll(
    buildSelector(animationClasses)
  );

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
     📌 Navigation fixed on scroll
     ===================================================== */

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

  /* =====================================================
     Mobile Navigation Toggle
     ===================================================== */

  navIcon.addEventListener("click", function () {
    mobileList.classList.toggle("show");
    navIcon.classList.toggle("rotate");
  });

});
