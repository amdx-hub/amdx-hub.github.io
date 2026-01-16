document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     Variablen
  ===================================================== */
  const navIcon = document.getElementById("nav-toggle");
  const mobileList = document.getElementById("mobile-menu");
  const header = document.querySelector("nav");
  const ctaBtn = document.querySelector(".cta");
  const btns = document.querySelectorAll(".js-btn");
  const mobileBtns = document.querySelectorAll(".js-mobile-btn");

  /* =====================================================
     Helper: Header Offset
  ===================================================== */
  function getHeaderOffset() {
    return header ? header.offsetHeight : 100;
  }

  /* =====================================================
     Mobile Menü Toggle
  ===================================================== */
  const closeMobileMenu = () => {
    if (mobileList && mobileList.classList.contains("show")) {
      mobileList.classList.remove("show");
      navIcon?.classList.remove("rotate");
      navIcon?.setAttribute("aria-expanded", "false");
      navIcon?.setAttribute("aria-label", "Open navigation");
    }
  };

  const toggleMenu = () => {
    const isOpen = mobileList.classList.toggle("show");
    navIcon.classList.toggle("rotate", isOpen);
    navIcon.setAttribute("aria-expanded", isOpen);
    navIcon.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  };

  if (navIcon) {
    navIcon.addEventListener("click", toggleMenu);
    navIcon.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  /* =====================================================
     Active-State Helper
  ===================================================== */
  function setActiveNav(targetHash = null) {
    const path = location.pathname.replace(/\/$/, "") || "/";
    const hash = targetHash || location.hash.replace("#", "");

    document.querySelectorAll(".js-btn, .js-mobile-btn").forEach(link => {
      const url = new URL(link.getAttribute("href"), location.origin);
      const linkPath = url.pathname.replace(/\/$/, "") || "/";
      const linkHash = url.hash.replace("#", "");

      let active = false;

      // Gleiche Seite + Hash
      if (linkPath === path && linkHash && linkHash === hash) active = true;

      // Seite ohne Hash
      if (linkPath === path && !linkHash && !hash) active = true;

      link.classList.toggle("selected", active);
    });
  }

  /* =====================================================
     Smooth Scroll + Cross-Page Navigation
  ===================================================== */
  const scrollToTarget = (el) => {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: el.offsetTop - getHeaderOffset(),
        behavior: "smooth"
      });
    });
  };

  function handleNavClick(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");
    if (!href) return;

    const hash = href.includes("#") ? href.split("#")[1] : null;

    // Mobile-Menü schließen immer
    closeMobileMenu();

    // Active-State sofort setzen
    setActiveNav(hash);

    // Nur Hash scrollen
    if (!hash) return;

    const [targetUrl = "/", targetHash] = href.split("#");
    const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
    const destinationPath = new URL(targetUrl || "/", location.origin)
      .pathname.replace(/\/$/, "") || "/";

    event.preventDefault();

    // Cross-Page
    if (currentPath !== destinationPath) {
      sessionStorage.setItem("scrollToHash", targetHash);
      window.location.href = destinationPath + "#" + targetHash;
      return;
    }

    // Same Page Scroll
    const targetEl = document.getElementById(targetHash);
    if (targetEl) scrollToTarget(targetEl);
  }

  // Links binden
  btns.forEach(btn => btn.addEventListener("click", handleNavClick));
  mobileBtns.forEach(btn => btn.addEventListener("click", handleNavClick));

  /* =====================================================
     Hashchange / SessionStorage → Cross-Page Scroll + Active-State
  ===================================================== */
  const checkScrollFromSession = () => {
    const savedHash = sessionStorage.getItem("scrollToHash") || window.location.hash.slice(1);
    if (savedHash) {
      const targetEl = document.getElementById(savedHash);
      if (targetEl) scrollToTarget(targetEl);
      setActiveNav(savedHash);
      sessionStorage.removeItem("scrollToHash");
    } else {
      setActiveNav();
    }
  };

  window.addEventListener("load", checkScrollFromSession);
  window.addEventListener("hashchange", () => {
    setActiveNav(location.hash.slice(1));
    closeMobileMenu();
    const targetEl = document.getElementById(location.hash.slice(1));
    if (targetEl) scrollToTarget(targetEl);
  });

  /* =====================================================
     Tiny Slider Initialisierung
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
     Intersection Observer – Scroll Animation
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
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });

    animatedElements.forEach(el => revealObserver.observe(el));
  }

  /* =====================================================
     Sticky Navigation beim Scroll über .cta
  ===================================================== */
  if ("IntersectionObserver" in window && ctaBtn) {
    const navObserver = new IntersectionObserver(entries => {
      header.classList.toggle("fixed", !entries[0].isIntersecting);
    }, { rootMargin: "-80px 0px 0px 0px", threshold: 0 });

    navObserver.observe(ctaBtn);
  }

});
