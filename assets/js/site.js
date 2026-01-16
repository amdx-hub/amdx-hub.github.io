document.addEventListener("DOMContentLoaded", function () {

  /* ==========================
     Variablen
  ========================== */
  const header = document.querySelector("nav");
  const ctaBtn = document.querySelector(".cta");
  const mobileList = document.getElementById("mobile-menu");
  const navIcon = document.getElementById("nav-toggle");
  const btns = document.querySelectorAll(".js-btn");
  const mobilebtns = document.querySelectorAll(".js-mobile-btn");

  /* ==========================
     Helper: Header Offset
  ========================== */
  function getHeaderOffset() {
    return header ? header.offsetHeight : 100;
  }

  /* ==========================
     Smooth Scroll (Desktop + Mobile)
     – inkl. Cross-Page Scroll
  ========================== */
  function smoothScroll(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");

    if (!href || href.indexOf("#") === -1) return;

    const hash = href.split("#")[1];
    if (!hash) return;

    const targetUrl = href.split("#")[0] || window.location.origin + "/";
    const targetEl = document.getElementById(hash);

    event.preventDefault();

    if (window.location.pathname === new URL(targetUrl, window.location.origin).pathname) {
      // Scroll auf derselben Seite
      if (targetEl) {
        window.scrollTo({
          top: targetEl.offsetTop - getHeaderOffset(),
          behavior: "smooth"
        });
      }
    } else {
      // Scroll auf anderer Seite
      sessionStorage.setItem("scrollToHash", hash);
      window.location.href = targetUrl + "#" + hash;
      return;
    }

    // Active State
    btns.forEach(l => l.classList.remove("selected"));
    mobilebtns.forEach(l => l.classList.remove("selected"));
    link.classList.add("selected");

    // Mobile Menü schließen
    if (mobileList && mobileList.classList.contains("show")) {
      mobileList.classList.remove("show");
      navIcon.classList.remove("rotate");
      navIcon.setAttribute("aria-expanded", "false");
      navIcon.setAttribute("aria-label", "Open navigation");
    }
  }

  btns.forEach(btn => btn.addEventListener("click", smoothScroll));
  mobilebtns.forEach(btn => btn.addEventListener("click", smoothScroll));

  /* ==========================
     Mobile Menü Toggle + ARIA
  ========================== */
  if (navIcon && mobileList) {
    navIcon.setAttribute("aria-expanded", "false");
    navIcon.setAttribute("aria-label", "Open navigation");
    navIcon.setAttribute("aria-controls", "mobile-menu");

    navIcon.addEventListener("click", function () {
      const isOpen = mobileList.classList.toggle("show");
      navIcon.classList.toggle("rotate", isOpen);
      navIcon.setAttribute("aria-expanded", isOpen);
      navIcon.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    // Tastaturbedienung (Enter/Space)
    navIcon.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navIcon.click();
      }
    });
  }

  /* ==========================
     Cross-Page Scroll nach Laden
  ========================== */
  const savedHash = sessionStorage.getItem("scrollToHash");
  if (savedHash) {
    const el = document.getElementById(savedHash);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - getHeaderOffset(),
        behavior: "smooth"
      });
    }
    sessionStorage.removeItem("scrollToHash");
  }

  /* ==========================
     IntersectionObserver für Animationen
  ========================== */
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
    }, {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px"
    });

    animatedElements.forEach(el => revealObserver.observe(el));
  }

  /* ==========================
     Sticky Navigation über .cta
  ========================== */
  if ("IntersectionObserver" in window && ctaBtn && header) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          header.classList.add("fixed");
        } else {
          header.classList.remove("fixed");
        }
      });
    }, {
      rootMargin: "-80px 0px 0px 0px",
      threshold: 0
    });

    navObserver.observe(ctaBtn);
  }

  /* ==========================
     Tiny Slider Initialisierung
  ========================== */
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

  /* ==========================
     Optional: JS Prefetch (für z.B. Charts)
  ========================== */
  // const prefetchJS = (url) => {
  //   const link = document.createElement("link");
  //   link.rel = "prefetch";
  //   link.href = url;
  //   document.head.appendChild(link);
  // };
  // prefetchJS("/assets/js/chart.min.js");

});
