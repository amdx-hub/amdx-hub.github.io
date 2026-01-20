document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
     Elements
  ===================================================== */
  const navToggle  = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const header     = document.querySelector("nav");
  const cta        = document.querySelector(".cta");
  const navLinks   = document.querySelectorAll(".js-btn, .js-mobile-btn");

  if (!navLinks.length) return;

  /* =====================================================
     Helpers
  ===================================================== */
  const cleanPath = p => (p || "/").replace(/\/$/, "") || "/";
  const getHash = () => location.hash.slice(1);
  const headerOffset = () => header?.offsetHeight || 100;

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
    navToggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation"
    );
  };

  const scrollToEl = el => {
    if (!el) return;
    window.requestAnimationFrame(() => {
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
  const setActiveNav = (hash = getHash()) => {
    const currentPath = cleanPath(location.pathname);

    navLinks.forEach(link => {
      const url = new URL(link.getAttribute("href"), location.origin);
      const active =
        cleanPath(url.pathname) === currentPath &&
        url.hash.replace("#", "") === hash;

      link.classList.toggle("selected", active);
    });
  };

  /* =====================================================
     Navigation Click Handling
  ===================================================== */
  const handleNavClick = e => {
    const link = e.currentTarget;
    const href = link.getAttribute("href");
    if (!href) return;

    const [urlPart = "/", hash] = href.split("#");
    const currentPath = cleanPath(location.pathname);
    const destinationPath = cleanPath(
      new URL(urlPart, location.origin).pathname
    );

    closeMobileMenu();
    setActiveNav(hash);

    if (!hash) return;

    e.preventDefault();

    if (currentPath !== destinationPath) {
      sessionStorage.setItem("scrollToHash", hash);
      location.href = `${destinationPath}#${hash}`;
      return;
    }

    scrollToEl(document.getElementById(hash));
    history.replaceState(null, "", `#${hash}`);
  };

  navLinks.forEach(link =>
    link.addEventListener("click", handleNavClick)
  );

  /* =====================================================
     Restore Scroll after Page Change
  ===================================================== */
  window.addEventListener("load", () => {
    const hash =
      sessionStorage.getItem("scrollToHash") || getHash();

    if (hash) {
      scrollToEl(document.getElementById(hash));
      history.replaceState(null, "", `#${hash}`);
      sessionStorage.removeItem("scrollToHash");
    }

    setActiveNav(hash);
  });

  window.addEventListener("hashchange", () => {
    const hash = getHash();
    scrollToEl(document.getElementById(hash));
    setActiveNav(hash);
    closeMobileMenu();
  });

  /* =====================================================
     Tiny Slider (safe)
  ===================================================== */
  if (typeof tns === "function") {
    const slider = document.querySelector(".slide__container");
    slider &&
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

  /* =====================================================
     Scroll Reveal Animations
  ===================================================== */
  const revealEls = document.querySelectorAll(
    ".fadeIn,.fadeInUp,.fadeInLeft,.fadeInRight"
  );

  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(({ isIntersecting, target }) => {
          if (!isIntersecting) return;
          target.style.transitionDelay =
            (target.dataset.delay || 0) + "ms";
          target.classList.add("in-view");
          observer.unobserve(target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    revealEls.forEach(el => observer.observe(el));
  }

  /* =====================================================
     Sticky Navigation
  ===================================================== */
  if ("IntersectionObserver" in window && header && cta) {
    new IntersectionObserver(
      ([entry]) =>
        header.classList.toggle("fixed", !entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" }
    ).observe(cta);
  }
});
