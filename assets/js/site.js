document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     GLOBAL FIXES
  ===================================================== */
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  document.body.classList.remove("no-js");
  document.body.classList.add("js");

  /* =====================================================
     ELEMENTS & HELPERS
  ===================================================== */
  const navToggle  = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const header     = document.querySelector("nav");
  const cta        = document.querySelector(".cta");
  const navLinks   = document.querySelectorAll(".js-btn, .js-mobile-btn");

  const cleanPath = p => (p || "/").replace(/\/$/, "") || "/";
  const headerOffset = () => header?.offsetHeight || 100;

  const scrollToEl = (el, smooth = true) => {
    if (!el) return;
    requestAnimationFrame(() => {
      window.scrollTo({
        top: el.offsetTop - headerOffset(),
        behavior: smooth ? "smooth" : "auto"
      });
    });
  };

  /* =====================================================
     MOBILE MENU
  ===================================================== */
  const closeMobileMenu = () => {
    if (!mobileMenu?.classList.contains("show")) return;
    mobileMenu.classList.remove("show");
    navToggle?.classList.remove("rotate");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
  };

  const toggleMobileMenu = () => {
    if (!mobileMenu || !navToggle) return;
    const open = mobileMenu.classList.toggle("show");
    navToggle.classList.toggle("rotate", open);
    navToggle.setAttribute("aria-expanded", open);
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  };

  navToggle?.addEventListener("click", toggleMobileMenu);
  navToggle?.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMobileMenu();
    }
  });

  /* =====================================================
     ACTIVE STATE
  ===================================================== */
  function setActiveNav(hash = location.hash.slice(1)) {
    const currentPath = cleanPath(location.pathname);

    navLinks.forEach(link => {
      const url = new URL(link.getAttribute("href"), location.origin);
      const linkPath = cleanPath(url.pathname);
      const linkHash = url.hash.replace("#", "");

      const active =
        linkPath === currentPath &&
        ((linkHash && linkHash === hash) || (!linkHash && !hash));

      link.classList.toggle("selected", active);
    });
  }

  /* =====================================================
     NAV CLICK HANDLING
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

    if (currentPath !== destinationPath) {
      sessionStorage.setItem("scrollToHash", hash);
      location.href = destinationPath + "#" + hash;
      return;
    }

    scrollToEl(document.getElementById(hash));
    history.replaceState(null, "", "#" + hash);
  }

  navLinks.forEach(l => l.addEventListener("click", handleNavClick));

  /* =====================================================
     RESTORE SCROLL (MOBILE SAFE)
  ===================================================== */
  window.addEventListener("load", () => {
    const hash =
      sessionStorage.getItem("scrollToHash") ||
      location.hash.slice(1);

    if (!hash) {
      setActiveNav();
      return;
    }

    // ⛔ kill browser auto-scroll
    window.scrollTo(0, 0);

    // ⏱ wait for mobile layout stability
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          scrollToEl(el, false);
          history.replaceState(null, "", "#" + hash);
          setActiveNav(hash);
        }
        sessionStorage.removeItem("scrollToHash");
      }, 60);
    });
  });

  window.addEventListener("hashchange", () => {
    const hash = location.hash.slice(1);
    const el = document.getElementById(hash);
    if (el) scrollToEl(el);
    setActiveNav(hash);
    closeMobileMenu();
  });

  /* =====================================================
     SCROLL SPY (ACTIVE ON SCROLL)
  ===================================================== */
  const sectionMap = new Map();

  navLinks.forEach(link => {
    const url = new URL(link.getAttribute("href"), location.origin);
    const hash = url.hash.replace("#", "");
    if (!hash) return;

    const section = document.getElementById(hash);
    if (section) sectionMap.set(section, hash);
  });

  if ("IntersectionObserver" in window && sectionMap.size) {
    const spyObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const hash = sectionMap.get(entry.target);
          if (!hash) return;

          history.replaceState(null, "", "#" + hash);
          setActiveNav(hash);
        });
      },
      {
        rootMargin: `-${headerOffset()}px 0px -55% 0px`,
        threshold: 0
      }
    );

    sectionMap.forEach((_, section) => spyObserver.observe(section));
  }

  /* =====================================================
     REVEAL ANIMATIONS
  ===================================================== */
  const revealEls = document.querySelectorAll(
    ".fadeIn,.fadeInUp,.fadeInLeft,.fadeInRight"
  );

  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          e.target.style.transitionDelay =
            (e.target.dataset.delay || 0) + "ms";
          e.target.classList.add("in-view");
          obs.unobserve(e.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* =====================================================
     STICKY NAV
  ===================================================== */
  if ("IntersectionObserver" in window && cta && header) {
    const stickyObs = new IntersectionObserver(
      ([entry]) => header.classList.toggle("fixed", !entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
    );
    stickyObs.observe(cta);
  }

  /* =====================================================
     TINY SLIDER (SAFE)
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

});
