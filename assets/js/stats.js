
// Hilfsfunktionen aus deinem Code (leicht angepasst)
function getWeeksArray(count = 30, month = 3) {
  const labels = [];
  for (let i = 0; i < count; i++) {
    labels.push(`${month}/${i}`);
  }
  return labels;
}

// Feste, definierte Daten & Labels für jeden Chart:
const chartsConfig = [
  {
    id: "stats-0",
    type: "line",
    labels: getWeeksArray(30, 3),
    datasets: [{
      label: "Visits",
      borderColor: "rgba(174,155,255,0.67)",
      pointBackgroundColor: "#C0B2FC",
      pointBorderColor: "#AE9BFF",
      data: [
        120, 140, 160, 180, 200, 220, 210, 230, 250, 270,
        260, 280, 300, 320, 310, 330, 350, 370, 360, 380,
        400, 420, 410, 430, 450, 470, 460, 480, 500, 520
      ],
      pointRadius: 4,
      borderWidth: 1,
      fill: true,
    }],
  },

  {
    id: "stats-1",
    type: "bar",
    labels: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    datasets: [{
      label: "Sales",
      backgroundColor: "rgba(174,155,255,0.67)",
      data: [35, 52, 48, 60, 75, 90, 40]
    }],
    options: { title: { display: true, text: "Sales pro Wochentag" } }
  },
];

// Gemeinsame Optionen (wie in deinem Code)
const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  elements: { line: { tension: 0 } },
  legend: { display: false },
  scales: {
    yAxes: [{ ticks: { fontColor: "#444363", fontSize: 12 } }],
    xAxes: [{ ticks: { fontColor: "#444363", fontSize: 12 } }],
  }
};

// Charts erzeugen
chartsConfig.forEach(cfg => {
  const ctx = document.getElementById(cfg.id)?.getContext("2d");
  if (!ctx) return;

  new Chart(ctx, {
    type: cfg.type,
    data: { labels: cfg.labels, datasets: cfg.datasets },
    options: { ...baseOptions, ...(cfg.options || {}) }
  });
});
``
