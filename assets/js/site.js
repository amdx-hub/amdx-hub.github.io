document.addEventListener("DOMContentLoaded", () => {
  // JS ist aktiv → Body Klasse setzen
  document.body.classList.remove("no-js");
  document.body.classList.add("js");

  /* =====================================================
     Elements
  ===================================================== */
  const navToggle = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const header = document.querySelector("nav");
  const cta = document.querySelector(".cta");
  const navLinks = document.querySelectorAll(".js-btn, .js-mobile-btn");

  /* =====================================================
     Helpers
  ===================================================== */
  const cleanPath = p => (p || "/").replace(/\/$/, "") || "/";
  const headerOffset = () => header?.offsetHeight || 100;

  const closeMobileMenu = () => {
    if (!mobileMenu?.classList.contains("show")) return;
    mobileMenu.classList.remove("show");
    navToggle?.classList.remove("rotate");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
  };

  const toggleMobileMenu = () => {
    const open = mobileMenu.classList.toggle("show");
    navToggle.classList.toggle("rotate", open);
    navToggle.setAttribute("aria-expanded", open);
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  };

  const scrollToEl = el => {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: el.offsetTop - headerOffset(),
        behavior: "smooth"
      });
    });
  };

  /* =====================================================
     Mobile Menu Toggle
  ===================================================== */
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", toggleMobileMenu);
    navToggle.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMobileMenu();
      }
    });
  }

  /* =====================================================
     Active Navigation State
  ===================================================== */
  function setActiveNav(hash = location.hash.slice(1)) {
    const currentPath = cleanPath(location.pathname);

    navLinks.forEach(link => {
      const url = new URL(link.getAttribute("href"), location.origin);
      const linkPath = cleanPath(url.pathname);
      const linkHash = url.hash.replace("#", "");

      const active =
        (linkPath === currentPath && linkHash && linkHash === hash) ||
        (linkPath === currentPath && !linkHash && !hash);

      link.classList.toggle("selected", active);
    });
  }

  /* =====================================================
     Navigation Click Handling
  ===================================================== */
  function handleNavClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute("href");
    if (!href) return;

    const [targetUrl = "/", hash] = href.split("#");
    const currentPath = cleanPath(location.pathname);
    const destinationPath = cleanPath(
      new URL(targetUrl || "/", location.origin).pathname
    );

    closeMobileMenu();
    setActiveNav(hash);

    if (!hash) return;

    e.preventDefault();

    // Cross-page navigation
    if (currentPath !== destinationPath) {
      sessionStorage.setItem("scrollToHash", hash);
      location.href = destinationPath + "#" + hash;
      return;
    }

    // Same-page scroll
    const targetEl = document.getElementById(hash);
    if (targetEl) {
      scrollToEl(targetEl);
      history.replaceState(null, "", "#" + hash);
    }
  }

  navLinks.forEach(l => l.addEventListener("click", handleNavClick));

  /* =====================================================
     Restore Scroll after Page Change
  ===================================================== */
  window.addEventListener("load", () => {
    const hash = sessionStorage.getItem("scrollToHash") || location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) scrollToEl(el);
      history.replaceState(null, "", "#" + hash);
      sessionStorage.removeItem("scrollToHash");
    }
    setActiveNav(hash);
  });

  window.addEventListener("hashchange", () => {
    const hash = location.hash.slice(1);
    const el = document.getElementById(hash);
    if (el) scrollToEl(el);
    setActiveNav(hash);
    closeMobileMenu();
  });

  /* =====================================================
     Tiny Slider (safe)
  ===================================================== */
  if (typeof tns === "function") {
    const slider = document.querySelector(".slide__container");
    if (slider) {
      tns({
        container: slider,
        arrowKeys: true,
        nav: false,
        controlsText: [
          '<i class="fas fa-angle-left"></i>',
          '<i class="fas fa-angle-right"></i>'
        ]
      });
    }
  }

  /* =====================================================
     Scroll Reveal Animations
  ===================================================== */
  const revealEls = document.querySelectorAll(
    ".fadeIn,.fadeInUp,.fadeInLeft,.fadeInRight"
  );

  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay =
          (e.target.dataset.delay || 0) + "ms";
        e.target.classList.add("in-view");
        observer.unobserve(e.target);
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });

    revealEls.forEach(el => observer.observe(el));
  }

  /* =====================================================
     Sticky Navigation
  ===================================================== */
  if ("IntersectionObserver" in window && cta && header) {
    const stickyObs = new IntersectionObserver(
      ([entry]) => header.classList.toggle("fixed", !entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
    );
    stickyObs.observe(cta);
  }

});
