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
     Helper – Header Offset (immer korrekt)
  ===================================================== */
  function getHeaderOffset() {
    return header ? header.offsetHeight : 100;
  }

  function scrollToTarget(targetEl) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const offset = getHeaderOffset();
        window.scrollTo({
          top: targetEl.getBoundingClientRect().top + window.scrollY - offset,
          behavior: "smooth"
        });
      });
    });
  }

  /* =====================================================
     Mobile Navigation (hidden + aria korrekt)
  ===================================================== */
  function openMobileMenu() {
    if (!mobileList || !navIcon) return;
    mobileList.hidden = false;
    mobileList.classList.add("show");
    navIcon.classList.add("rotate");
    navIcon.setAttribute("aria-expanded", "true");
    navIcon.setAttribute("aria-label", "Close navigation");
  }

  function closeMobileMenu() {
    if (!mobileList || !navIcon) return;
    mobileList.classList.remove("show");
    mobileList.hidden = true;
    navIcon.classList.remove("rotate");
    navIcon.setAttribute("aria-expanded", "false");
    navIcon.setAttribute("aria-label", "Open navigation");
  }

  if (navIcon && mobileList) {
    navIcon.addEventListener("click", () => {
      mobileList.hidden ? openMobileMenu() : closeMobileMenu();
    });

    navIcon.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        mobileList.hidden ? openMobileMenu() : closeMobileMenu();
      }
    });
  }

  /* =====================================================
     Active State (Page + Hash + Scroll)
  ===================================================== */
  function setActiveNav(forceHash = null) {
    const currentPath = location.pathname.replace(/\/$/, "") || "/";
    const hash = forceHash || location.hash.replace("#", "");

    document.querySelectorAll(".js-btn, .js-mobile-btn").forEach(link => {
      const url = new URL(link.getAttribute("href"), location.origin);
      const linkPath = url.pathname.replace(/\/$/, "") || "/";
      const linkHash = url.hash.replace("#", "");

      let active = false;

      // Same page + hash
      if (linkPath === currentPath && linkHash && linkHash === hash) {
        active = true;
      }

      // Page without hash (e.g. /about)
      if (linkPath === currentPath && !linkHash && !hash) {
        active = true;
      }

      link.classList.toggle("selected", active);
    });
  }

  window.addEventListener("load", () => setActiveNav());
  window.addEventListener("hashchange", () => setActiveNav());

  /* =====================================================
     Smooth Scroll + Cross-Page Navigation
  ===================================================== */
  function handleNavClick(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");
    if (!href) return;

    // Immer Active-State sofort
    const hash = href.includes("#") ? href.split("#")[1] : null;
    setActiveNav(hash);

    // Mobile Menü IMMER schließen
    closeMobileMenu();

    if (!hash) return; // normale Seiten-Navigation

    const [targetUrl = "/", targetHash] = href.split("#");
    const destinationPath = new URL(targetUrl || "/", location.origin)
      .pathname.replace(/\/$/, "") || "/";
    const currentPath = location.pathname.replace(/\/$/, "") || "/";

    event.preventDefault();

    // Cross-Page
    if (currentPath !== destinationPath) {
      sessionStorage.setItem("scrollToHash", targetHash);
      window.location.href = destinationPath + "#" + targetHash;
      return;
    }

    // Same Page
    const targetEl = document.getElementById(targetHash);
    if (targetEl) scrollToTarget(targetEl);
  }

  btns.forEach(btn => btn.addEventListener("click", handleNavClick));
  mobileBtns.forEach(btn => btn.addEventListener("click", handleNavClick));

  /* =====================================================
     Scroll nach Seitenwechsel (#hash)
  ===================================================== */
  window.addEventListener("load", () => {
    const hash = sessionStorage.getItem("scrollToHash") || location.hash.slice(1);
    if (!hash) return;

    const targetEl = document.getElementById(hash);
    if (!targetEl) return;

    sessionStorage.removeItem("scrollToHash");

    setTimeout(() => {
      scrollToTarget(targetEl);
      setActiveNav(hash);
    }, 50);
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
        controlsText: [
          '<i class="fas fa-angle-left"></i>',
          '<i class="fas fa-angle-right"></i>'
        ],
        nav: false
      });
    }
  }

  /* =====================================================
     Intersection Observer – Animations (once)
  ===================================================== */
  const animated = document.querySelectorAll(
    ".fadeIn, .fadeInUp, .fadeInLeft, .fadeInRight"
  );

  if ("IntersectionObserver" in window && animated.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });

    animated.forEach(el => observer.observe(el));
  }

  /* =====================================================
     Sticky Navigation (CTA)
  ===================================================== */
  if ("IntersectionObserver" in window && ctaBtn && header) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        header.classList.toggle("fixed", !entry.isIntersecting);
      });
    }, { rootMargin: "-80px 0px 0px 0px", threshold: 0 });

    navObserver.observe(ctaBtn);
  }

});
