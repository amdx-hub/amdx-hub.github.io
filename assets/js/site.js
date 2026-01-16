document.addEventListener("DOMContentLoaded", function () {

  const navIcon = document.getElementById("nav-toggle");
  const mobileList = document.getElementById("mobile-menu");
  const header = document.querySelector("nav");
  const ctaBtn = document.querySelector(".cta");

  // Helper: Header Offset
  function getHeaderOffset() {
    return header ? header.offsetHeight : 100;
  }

  // =====================================================
  // Mobile Menü Toggle
  if (navIcon && mobileList) {
    const toggleMenu = () => {
      mobileList.classList.toggle("show");
      const isOpen = mobileList.classList.contains("show");
      navIcon.classList.toggle("rotate", isOpen);
      navIcon.setAttribute("aria-expanded", isOpen);
      navIcon.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    };

    navIcon.addEventListener("click", toggleMenu);
    navIcon.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  // =====================================================
  // Active-State Helper
  function setActiveLink(targetHref) {
    const allLinks = document.querySelectorAll(".js-btn, .js-mobile-btn");
    allLinks.forEach(link => {
      link.classList.toggle("selected", link.getAttribute("href") === targetHref);
    });
  }

  // =====================================================
  // Smooth Scroll
  function smoothScroll(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");
    if (!href || href.indexOf("#") === -1) return;

    const hash = href.split("#")[1];
    if (!hash) return;

    const targetUrl = href.split("#")[0] || "/";
    const targetEl = document.getElementById(hash);

    event.preventDefault();

    if (window.location.pathname === new URL(targetUrl, window.location.origin).pathname) {
      if (targetEl) {
        window.scrollTo({
          top: targetEl.offsetTop - getHeaderOffset(),
          behavior: "smooth"
        });
      }
    } else {
      sessionStorage.setItem("scrollToHash", hash);
      window.location.href = targetUrl + "#" + hash;
      return;
    }

    // Active-State
    setActiveLink(href);

    // Mobile Menü schließen
    if (mobileList && mobileList.classList.contains("show")) {
      mobileList.classList.remove("show");
      navIcon.classList.remove("rotate");
      navIcon.setAttribute("aria-expanded", false);
      navIcon.setAttribute("aria-label", "Open navigation");
    }
  }

  const btns = document.querySelectorAll(".js-btn");
  const mobilebtns = document.querySelectorAll(".js-mobile-btn");
  btns.forEach(btn => btn.addEventListener("click", smoothScroll));
  mobilebtns.forEach(btn => btn.addEventListener("click", smoothScroll));

  // Cross-Page Scroll nach Laden
  const savedHash = sessionStorage.getItem("scrollToHash");
  if (savedHash) {
    const el = document.getElementById(savedHash);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - getHeaderOffset(),
        behavior: "smooth"
      });
    }
    setActiveLink("#" + savedHash);
    sessionStorage.removeItem("scrollToHash");
  }

  // =====================================================
  // Tiny Slider
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

  // =====================================================
  // Intersection Observer Animation
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
    }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });

    animatedElements.forEach(el => revealObserver.observe(el));
  }

  // =====================================================
  // Sticky Navigation
  if ("IntersectionObserver" in window && ctaBtn) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        header.classList.toggle("fixed", !entry.isIntersecting);
      });
    }, { rootMargin: "-80px 0px 0px 0px", threshold: 0 });

    navObserver.observe(ctaBtn);
  }

});
