document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     Variablen
  ===================================================== */
  const navIcon = document.getElementById("nav-toggle"),
        mobileList = document.getElementById("mobile-menu"),
        header = document.querySelector("nav"),
        ctaBtn = document.querySelector(".cta"),
        btns = document.querySelectorAll(".js-btn"),
        mobileBtns = document.querySelectorAll(".js-mobile-btn");

  /* =====================================================
     Helper: Header Offset
  ===================================================== */
  const getHeaderOffset = () => header?.offsetHeight || 100;

  /* =====================================================
     Mobile Menü Toggle
  ===================================================== */
  const closeMobileMenu = () => {
    if (mobileList?.classList.contains("show")) {
      mobileList.classList.remove("show");
      navIcon?.classList.remove("rotate");
      navIcon?.setAttribute("aria-expanded", "false");
      navIcon?.setAttribute("aria-label", "Open navigation");
    }
  };

  const toggleMenu = () => {
    const open = mobileList.classList.toggle("show");
    navIcon.classList.toggle("rotate", open);
    navIcon.setAttribute("aria-expanded", open);
    navIcon.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  };

  navIcon?.addEventListener("click", toggleMenu);
  navIcon?.addEventListener("keydown", e => {
    if (["Enter", " "].includes(e.key)) {
      e.preventDefault();
      toggleMenu();
    }
  });

  /* =====================================================
     Active-State Helper
  ===================================================== */
  const setActiveNav = (hash = null) => {
    const path = location.pathname.replace(/\/$/, "") || "/";
    hash = hash || location.hash.replace("#", "");
    document.querySelectorAll(".js-btn, .js-mobile-btn").forEach(link => {
      const url = new URL(link.getAttribute("href"), location.origin),
            linkPath = url.pathname.replace(/\/$/, "") || "/",
            linkHash = url.hash.replace("#", "");
      link.classList.toggle("selected",
        (linkPath === path && linkHash && linkHash === hash) ||
        (linkPath === path && !linkHash && !hash)
      );
    });
  };

  /* =====================================================
     Smooth Scroll + Cross-Page Navigation
  ===================================================== */
  const scrollTo = el => requestAnimationFrame(() => 
    window.scrollTo({ top: el.offsetTop - getHeaderOffset(), behavior: "smooth" })
  );

  const handleNavClick = e => {
    const link = e.currentTarget;
    const href = link.getAttribute("href");
    if (!href) return;

    const [targetUrl = "/", hash] = href.split("#");
    closeMobileMenu();
    setActiveNav(hash || null);

    const currentPath = location.pathname.replace(/\/$/, "") || "/";
    const destinationPath = new URL(targetUrl, location.origin).pathname.replace(/\/$/, "") || "/";

    e.preventDefault();

    if (currentPath !== destinationPath) {
      sessionStorage.setItem("scrollToHash", hash);
      location.href = destinationPath + (hash ? "#" + hash : "");
      return;
    }

    if (hash) {
      const targetEl = document.getElementById(hash);
      if (targetEl) scrollTo(targetEl);
    }
  };

  [...btns, ...mobileBtns].forEach(btn => btn.addEventListener("click", handleNavClick));

  /* =====================================================
     Scroll / Hash Change Handling
  ===================================================== */
  const checkScrollFromSession = () => {
    const savedHash = sessionStorage.getItem("scrollToHash") || location.hash.slice(1);
    if (savedHash) {
      const el = document.getElementById(savedHash);
      if (el) scrollTo(el);
      setActiveNav(savedHash);
      sessionStorage.removeItem("scrollToHash");
    } else setActiveNav();
  };

  window.addEventListener("load", checkScrollFromSession);
  window.addEventListener("hashchange", () => {
    setActiveNav(location.hash.slice(1));
    closeMobileMenu();
    const el = document.getElementById(location.hash.slice(1));
    if (el) scrollTo(el);
  });

  /* =====================================================
     Tiny Slider
  ===================================================== */
  if (typeof tns === "function") {
    const slider = document.querySelector(".slide__container");
    slider && tns({
      container: slider,
      arrowKeys: true,
      controlsText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
      nav: false
    });
  }

  /* =====================================================
     Intersection Observer – Scroll Animation
  ===================================================== */
  const animClasses = ["fadeIn", "fadeInUp", "fadeInLeft", "fadeInRight"];
  const animatedEls = document.querySelectorAll(animClasses.map(c => "." + c).join(","));
  if ("IntersectionObserver" in window && animatedEls.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = (e.target.dataset.delay || 0) + "ms";
          e.target.classList.add("in-view");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
    animatedEls.forEach(el => observer.observe(el));
  }

  /* =====================================================
     Sticky Navigation beim Scroll über .cta
  ===================================================== */
  if (ctaBtn && "IntersectionObserver" in window) {
    new IntersectionObserver(entries => {
      header.classList.toggle("fixed", !entries[0].isIntersecting);
    }, { rootMargin: "-80px 0px 0px 0px", threshold: 0 }).observe(ctaBtn);
  }

});
