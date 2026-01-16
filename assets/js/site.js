// Sehr reduziertes JS (ca. 40–60 Zeilen statt 200)
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-menu");
  const links = document.querySelectorAll('a[href^="#"], a[href*="/#"]'); // beide Varianten

  // Mobile Toggle
  toggle?.addEventListener("click", () => {
    menu.classList.toggle("show");
    toggle.classList.toggle("rotate");
    const expanded = menu.classList.contains("show");
    toggle.setAttribute("aria-expanded", expanded);
  });

  // Schließen bei Klick auf Link (mobile)
  links.forEach(link => {
    link.addEventListener("click", () => {
      if (menu.classList.contains("show")) {
        menu.classList.remove("show");
        toggle?.classList.remove("rotate");
        toggle?.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Active Link + Cross-Page via sessionStorage
  function updateActive() {
    const hash = location.hash.slice(1) || sessionStorage.getItem("scrollHash") || "";
    sessionStorage.removeItem("scrollHash");

    document.querySelectorAll(".js-btn, .js-mobile-btn").forEach(a => {
      const target = a.getAttribute("href").split("#")[1];
      a.classList.toggle("selected", target === hash);
    });
  }

  window.addEventListener("hashchange", updateActive);
  window.addEventListener("load", () => {
    if (location.hash) {
      // Warten bis Inhalt da ist (kleiner Trick)
      setTimeout(updateActive, 50);
    } else {
      updateActive();
    }
  });

  // Optional: IntersectionObserver für Sticky-Look-Änderung (wenn du magst)
  document.querySelector(".hero")?.let(el => new IntersectionObserver(([e]) => {
    nav.classList.toggle("fixed", !e.isIntersecting);
    }, {threshold: 0}).observe(el));
});
