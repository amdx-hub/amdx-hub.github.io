document.addEventListener("DOMContentLoaded", function () {

  /* =====================================================
     Variablen
  ===================================================== */
  const navIcon = document.getElementById("nav-toggle");
  const mobileList = document.getElementById("mobile-menu");
  const header = document.querySelector("nav");
  const ctaBtn = document.querySelector(".cta");

  /* =====================================================
     Helper: Header Offset
  ===================================================== */
  function getHeaderOffset() {
    return header ? header.offsetHeight : 100;
  }

  /* =====================================================
     Mobile Menü Toggle
  ===================================================== */
  if (navIcon && mobileList) {
    navIcon.addEventListener("click", () => {
      const isOpen = !mobileList.hidden;
      mobileList.hidden = isOpen;
      navIcon.classList.toggle("rotate", !isOpen);
      navIcon.setAttribute("aria-expanded", !isOpen);
      navIcon.setAttribute(
        "aria-label",
        !isOpen ? "Close navigation" : "Open navigation"
      );
    });
  }

  /* =====================================================
     Active State Helper
     (funktioniert auf allen Seiten)
  ===================================================== */
  function setActiveLink(targetHref) {
    const allLinks = document.querySelectorAll(".js-btn, .js-mobile-btn");
    allLinks.forEach(link => {
      if (link.getAttribute("href") === targetHref) {
        link.classList.add("selected");
      } else {
        link.classList.remove("selected");
      }
    });
  }

  /* =====================================================
     Smooth Scroll (Desktop + Mobile)
     inkl. Cross-Page Scroll
  ===================================================== */
  function smoothScroll(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");

    if (!href || href.indexOf("#") === -1) return;

    const hash = href.split("#")[1];
    if (!hash) return;

    const targetUrl = href.split("#")[0] || "/";
    const targetEl = document.getElementById(hash);

    event.preventDefault();

    if (
      window.location.pathname ===
      new URL(targetUrl, window.location.origin).pathname
    ) {
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

    // Active-State setzen
    setActiveLink(href);

    // Mobile Menü schließen
    if (mobileList && !mobileList.hidden) {
      mobileList.hidden = true;
      navIcon.classList.remove("rotate");
      navIcon.setAttribute("aria-expanded", false);
      navIcon.setAttribute("aria-label", "Open navigation");
    }
  }

  // Event Listener für alle Links
  const btns = document.querySelectorAll(".js-btn");
  const mobilebtns = document.querySelectorAll(".js-mobile-btn");
  btns.forEach(btn => btn.addEventListener("click", smoothScroll));
  mobilebtns.forEach(btn => btn.addEventListener("click", smoothScroll));

  /* =====================================================
     Cross-Page Scroll nach Laden
  ===================================================== */
  const savedHash = sessionStorage.getItem("scrollToHash");
  if (savedHash) {
    const el = document.getElementById(savedHash);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - getHeaderOffset(),
        behavior: "smooth"
      });
    }
    // Active-State auf Cross-Page Link setzen
    setActiveLink("#" + savedHash);
    sessionStorage.removeItem("scrollToHash");
  }

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
     Intersection Observer – Scroll Animation (einmalig)
  ===================================================== */
  const animationClasses = ["fadeIn", "fadeInUp", "fadeInLeft", "fadeInRight"];
  const animatedElements = document.querySelectorAll(
    animationClasses.map(c => "." + c).join(",")
  );

  if ("IntersectionObserver" in window && animatedElements.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          entry.target.style.transitionDelay = delay + "ms";
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target); // nur einmal
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px"
    });

    animatedElements.forEach(el => revealObserver.observe(el));
  }

  /* =====================================================
     Sticky Navigation beim Scroll über .cta
  ===================================================== */
  if ("IntersectionObserver" in window && ctaBtn) {
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

});
