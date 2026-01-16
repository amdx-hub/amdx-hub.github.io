document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     Variablen
  ===================================================== */
  const navIcon = document.getElementById("nav-toggle");
  const mobileList = document.getElementById("mobile-menu");
  const header = document.querySelector("nav");
  const ctaBtn = document.querySelector(".cta");
  const btns = document.querySelectorAll(".js-btn");
  const mobilebtns = document.querySelectorAll(".js-mobile-btn");

  /* =====================================================
     Helper: Header Offset
  ===================================================== */
  function getHeaderOffset() {
    return header ? header.offsetHeight : 100;
  }

  /* =====================================================
     Mobile Menu Toggle
  ===================================================== */
  if (navIcon && mobileList) {
    const toggleMenu = () => {
      const isOpen = mobileList.classList.toggle("show");
      navIcon.classList.toggle("rotate", isOpen);
      navIcon.setAttribute("aria-expanded", isOpen);
      navIcon.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    };

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

    // 1️⃣ Gleiche Seite + Hash
    if (linkPath === path && linkHash && linkHash === hash) {
      active = true;
    }

    // 2️⃣ Seite ohne Hash (z. B. /about)
    if (linkPath === path && !linkHash && !hash) {
      active = true;
    }

    link.classList.toggle("selected", active);
  });
}

/* Initial */
window.addEventListener("load", () => setActiveNav());

/* Hash geändert (z. B. Browser / normaler Link) */
window.addEventListener("hashchange", () => setActiveNav());

/* Klick → sofort setzen */
document.addEventListener("click", e => {
  const link = e.target.closest(".js-btn, .js-mobile-btn");
  if (!link) return;

  const hash = link.getAttribute("href").split("#")[1];
  setActiveNav(hash || null);
});

  /* =====================================================
     Smooth Scroll + Cross-Page Navigation
  ===================================================== */
  function smoothScroll(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");
    if (!href || href.indexOf("#") === -1) return;

    const hash = href.split("#")[1];
    const targetUrl = href.split("#")[0] || "/";
    const targetEl = document.getElementById(hash);

    event.preventDefault();

    // Cross-Page Navigation
    if (window.location.pathname !== new URL(targetUrl, window.location.origin).pathname) {
      sessionStorage.setItem("scrollToHash", hash);
      window.location.href = targetUrl + "#" + hash;
      return;
    }

    // Scroll auf derselben Seite
    if (targetEl) {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: targetEl.offsetTop - getHeaderOffset(),
          behavior: "smooth"
        });
      });
    }

    // Active-State setzen
    setActiveLinkByHashOrPage(hash);

    // Mobile Menü schließen
    if (mobileList && mobileList.classList.contains("show")) {
      mobileList.classList.remove("show");
      navIcon.classList.remove("rotate");
      navIcon.setAttribute("aria-expanded", false);
      navIcon.setAttribute("aria-label", "Open navigation");
    }
  }

  btns.forEach(btn => btn.addEventListener("click", smoothScroll));
  mobilebtns.forEach(btn => btn.addEventListener("click", smoothScroll));

  /* =====================================================
     Scroll auf Hash nach Seitenwechsel
  ===================================================== */
  window.addEventListener("load", () => {
    const savedHash = sessionStorage.getItem("scrollToHash") || window.location.hash.slice(1);
    if (savedHash) {
      const targetEl = document.getElementById(savedHash);
      if (targetEl) {
        window.scrollTo({
          top: targetEl.offsetTop - getHeaderOffset(),
          behavior: "smooth"
        });
      }
      setActiveLinkByHashOrPage(savedHash);
      sessionStorage.removeItem("scrollToHash");
    } else {
      setActiveLinkByHashOrPage();
    }
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
      entries.forEach(entry => {
        header.classList.toggle("fixed", !entry.isIntersecting);
      });
    }, { rootMargin: "-80px 0px 0px 0px", threshold: 0 });

    navObserver.observe(ctaBtn);
  }

});
