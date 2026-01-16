document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     Grundvariablen
  ===================================================== */

  const header = document.querySelector("nav");
  const ctaBtn = document.querySelector(".cta");
  const allNavLinks = [...document.querySelectorAll(".js-btn, .js-mobile-btn")];

  let headerOffset = header ? header.offsetHeight : 100;

  window.addEventListener("resize", () => {
    headerOffset = header ? header.offsetHeight : 100;
  });

  /* =====================================================
     Tiny Slider (safe)
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
     Mobile Navigation Toggle (ROBUST)
  ===================================================== */

  document.addEventListener("click", (e) => {
    const icon = e.target.closest(".nav--icon");
    if (!icon) return;

    const navMobile = icon.closest(".nav--mobile");
    if (!navMobile) return;

    const mobileList = navMobile.querySelector(".mobile-list");
    if (!mobileList) return;

    mobileList.classList.toggle("show");
    icon.classList.toggle("rotate");
  });

  function closeMobileMenu() {
    document.querySelectorAll(".mobile-list.show").forEach(list => {
      list.classList.remove("show");
    });
    document.querySelectorAll(".nav--icon.rotate").forEach(icon => {
      icon.classList.remove("rotate");
    });
  }

  /* =====================================================
     Smooth Scroll (inkl. Seitenwechsel)
  ===================================================== */

  function smoothScroll(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");
    if (!href || !href.includes("#")) return;

    const url = new URL(href, window.location.href);
    const targetId = url.hash.replace("#", "");
    if (!targetId) return;

    // Seitenwechsel
    if (url.pathname !== window.location.pathname) {
      window.location.href = url.href;
      return;
    }

    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    event.preventDefault();

    window.scrollTo({
      top: targetEl.offsetTop - headerOffset,
      behavior: "smooth"
    });

    // Active State
    allNavLinks.forEach(l => l.classList.remove("selected"));
    link.classList.add("selected");

    closeMobileMenu();

    history.pushState(null, "", "#" + targetId);
  }

  allNavLinks.forEach(link => link.addEventListener("click", smoothScroll));

  /* =====================================================
     Hash-Scroll nach Seitenwechsel
  ===================================================== */

  if (window.location.hash) {
    const targetEl = document.getElementById(window.location.hash.replace("#", ""));
    if (targetEl) {
      setTimeout(() => {
        window.scrollTo({
          top: targetEl.offsetTop - headerOffset,
          behavior: "smooth"
        });
      }, 80);
    }
  }

  /* =====================================================
     Intersection Observer – Animationen (einmalig)
  ===================================================== */

  const animationClasses = ["fadeIn", "fadeInUp", "fadeInLeft", "fadeInRight"];
  const animatedElements = document.querySelectorAll(
    animationClasses.map(c => "." + c).join(",")
  );

  if ("IntersectionObserver" in window && animatedElements.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
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

  /* =====================================================
     Sticky Navigation über CTA
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

});
