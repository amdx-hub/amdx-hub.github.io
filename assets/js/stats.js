
document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("stats-0").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mo","Di","Mi","Do","Fr"],
      datasets: [{
        label: "Testdaten",
        data: [10, 20, 15, 30, 25],
        borderColor: "rgba(174,155,255,0.67)",
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: "Test-Chart" }
      },
      scales: {
        x: { ticks: { color: "#444363" } },
        y: { ticks: { color: "#444363" } }
      }
    }
  });
});
