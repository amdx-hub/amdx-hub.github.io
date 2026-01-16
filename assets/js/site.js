document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     Variablen
  ========================= */
  const navIcon = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const header = document.querySelector("nav");
  const btnLinks = document.querySelectorAll(".js-btn, .js-mobile-btn");
  const ctaBtn = document.querySelector(".cta");

  const baseUrl = "{{ site.baseurl }}"; // Jekyll BaseURL

  /* =========================
     Header Offset Helper
  ========================= */
  const getHeaderOffset = () => header ? header.offsetHeight : 100;

  /* =========================
     Mobile Menü Toggle
  ========================= */
  const closeMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("show");
    navIcon?.classList.remove("rotate");
    navIcon?.setAttribute("aria-expanded", "false");
    navIcon?.setAttribute("aria-label", "Open navigation");
  };

  const toggleMobileMenu = () => {
    const isOpen = mobileMenu.classList.toggle("show");
    navIcon.classList.toggle("rotate", isOpen);
    navIcon.setAttribute("aria-expanded", isOpen);
    navIcon.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  };

  navIcon?.addEventListener("click", toggleMobileMenu);
  navIcon?.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMobileMenu();
    }
  });

  /* =========================
     Active-State
  ========================= */
  const setActiveNav = (hash = null) => {
    const path = location.pathname.replace(/\/$/, "") || "/";
    const currentHash = hash ?? location.hash.replace("#", "");

    btnLinks.forEach(link => {
      const url = new URL(link.getAttribute("href"), location.origin);
      const linkPath = url.pathname.replace(/\/$/, "") || "/";
      const linkHash = url.hash.replace("#", "");

      const active = (linkPath === path && linkHash === currentHash) || 
                     (linkPath === path && !linkHash && !currentHash);
      link.classList.toggle("selected", active);
    });
  };

  /* =========================
     Smooth Scroll + Cross-Page
  ========================= */
  const scrollToTarget = (el) => {
    window.scrollTo({
      top: el.offsetTop - getHeaderOffset(),
      behavior: "smooth"
    });
  };

  const handleNavClick = (e) => {
    const link = e.currentTarget;
    const href = link.getAttribute("href");
    if (!href) return;

    const [targetPath = "/", targetHash] = href.split("#");
    const currentPath = location.pathname.replace(/\/$/, "") || "/";
    const destPath = new URL(targetPath, location.origin).pathname.replace(/\/$/, "") || "/";

    // Mobile Menü schließen immer
    closeMobileMenu();

    // Active-State sofort
    setActiveNav(targetHash);

    // Cross-Page Navigation
    if (currentPath !== destPath) {
      if (targetHash) sessionStorage.setItem("scrollToHash", targetHash);
      window.location.href = baseUrl + destPath + (targetHash ? "#" + targetHash : "");
      e.preventDefault();
      return;
    }

    // Same-Page Scroll
    if (targetHash) {
      const targetEl = document.getElementById(targetHash);
      if (targetEl) scrollToTarget(targetEl);
      e.preventDefault();
    }
  };

  btnLinks.forEach(link => link.addEventListener("click", handleNavClick));

  /* =========================
     Scroll auf Hash nach Seitenwechsel
  ========================= */
  const checkSessionHash = () => {
    const hash = sessionStorage.getItem("scrollToHash") || location.hash.slice(1);
    if (!hash) return;

    const targetEl = document.getElementById(hash);
    if (targetEl) scrollToTarget(targetEl);
    setActiveNav(hash);
    sessionStorage.removeItem("scrollToHash");
  };

  window.addEventListener("load", checkSessionHash);
  window.addEventListener("hashchange", () => setActiveNav(location.hash.slice(1)));

  /* =========================
     ScrollSpy für Active-State
  ========================= */
  const sectionElems = document.querySelectorAll("section[id]");
  if ("IntersectionObserver" in window && sectionElems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    }, { threshold: 0.5 });

    sectionElems.forEach(sec => observer.observe(sec));
  }

  /* =========================
     Tiny Slider
  ========================= */
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
