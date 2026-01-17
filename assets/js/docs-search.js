document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("docs-search");
  const items = document.querySelectorAll("#docs-list li");

  if (!input) return;

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();

    items.forEach(item => {
      const title = item.dataset.title;
      item.style.display = title.includes(value) ? "" : "none";
    });
  });
});