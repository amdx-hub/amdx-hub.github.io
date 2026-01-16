document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     Basis-Elemente
  ===================================================== */

  const header = document.querySelector("nav");
  const ctaBtn = document.querySelector(".cta");
  const navLinks = document.querySelectorAll(".js-btn, .js-mobile-btn");

  let headerOffset = header ? header.offsetHeight : 100;

  window.addEventListener("resize", () => {
    headerOffset = header ? header.offsetHeight : 100;
  });

  /* =====================================================
     Tiny Slider (safe)
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
     Mobile Navigation (FINAL FIX)
  ===================================================== */

  const mobileNavs = document.querySelectorAll(".nav--mobile");

  mobileNavs.forEach(nav => {
    const icon = nav.querySelector(".nav--icon");
    const list = nav.querySelector(".mobile-list");

    if (!icon || !list) return;

    icon.addEventListener("click", (e) => {
      e.stopPropagation(); // 🔥 extrem wichtig
      const isOpen = list.classList.toggle("show");
      icon.classList.toggle("rotate", isOpen);
      icon.setAttribute("aria-expanded", isOpen);
    });
  });

  function closeMobileMenus() {
    document.querySelectorAll(".mobile-list.show").forEach(list => {
      list.classList.remove("show");
    });
    document.querySelectorAll(".nav--icon.rotate").forEach(icon => {
      icon.classList.remove("rotate");
      icon.setAttribute("aria-expanded", "false");
    });
  }

  /* =====================================================
     Smooth Scroll (seitenübergreifend)
  ===================================================== */

  function smoothScroll(e) {
    const link = e.currentTarget;
    const href = link.getAttribute("href");
    if (!href || !href.includes("#")) return;

    const url = new URL(href, window.location.href);
    const id = url.hash.replace("#", "");
    if (!id) return;

    // Seitenwechsel
    if (url.pathname !== window.location.pathname) {
      window.location.href = url.href;
      return;
    }

    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();

    window.scrollTo({
      top: target.offsetTop - headerOffset,
      behavior: "smooth"
    });

    navLinks.forEach(l => l.classList.remove("selected"));
    link.classList.add("selected");

    closeMobileMenus();

    history.pushState(null, "", "#" + id);
  }

  navLinks.forEach(link => {
    link.addEventListener("click", smoothScroll);
  });

  /* =====================================================
     Hash-Scroll nach Seitenwechsel
  ===================================================== */

  if (window.location.hash) {
    const target = document.getElementById(window.location.hash.substring(1));
    if (target) {
      setTimeout(() => {
        window.scrollTo({
          top: target.offsetTop - headerOffset,
          behavior: "smooth"
        });
      }, 80);
    }
  }

  /* =====================================================
     Intersection Observer – Animationen
  ===================================================== */

  const animated = document.querySelectorAll(
    ".fadeIn, .fadeInUp, .fadeInLeft, .fadeInRight"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px"
    });

    animated.forEach(el => observer.observe(el));
  }

/* =====================================================
   Scroll Spy – Active State beim Scroll
===================================================== */

const sections = document.querySelectorAll("section[id]");

if ("IntersectionObserver" in window && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute("id");
      if (!id) return;

      allNavLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href && href.includes("#" + id)) {
          allNavLinks.forEach(l => l.classList.remove("selected"));
          link.classList.add("selected");
        }
      });
    });
  }, {
    rootMargin: "-50% 0px -45% 0px",
    threshold: 0
  });

  sections.forEach(section => sectionObserver.observe(section));
}
  
  /* =====================================================
     Sticky Navigation
  ===================================================== */

  if ("IntersectionObserver" in window && ctaBtn && header) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        header.classList.toggle("fixed", !entry.isIntersecting);
      });
    }, {
      rootMargin: "-80px 0px 0px 0px"
    });

    navObserver.observe(ctaBtn);
  }

});
