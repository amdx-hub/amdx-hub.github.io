
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
      fill: false,
    }],
    options: { title: { display: true, text: "Visits (März)" } }
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

  {
    id: "stats-2",
    type: "line",
    labels: getWeeksArray(20, 4),
    datasets: [
      { label: "Signups", borderColor: "#4ade80", data: [5,7,6,9,8,10,12,11,15,14,16,18,17,20,22,21,24,26,25,28], pointRadius: 0, fill: false },
      { label: "Churn",   borderColor: "#ef4444", data: [2,3,2,4,3,5,4,5,6,5,6,7,6,7,8,7,9,8,9,10], pointRadius: 0, fill: false }
    ],
    options: { title: { display: true, text: "Signups vs Churn (April)" }, legend: { display: true } }
  },

  {
    id: "stats-3",
    type: "bar",
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      { label: "Product A", backgroundColor: "#60a5fa", data: [120, 180, 160, 200] },
      { label: "Product B", backgroundColor: "#f59e0b", data: [80, 90, 110, 130] }
    ],
    options: {
      title: { display: true, text: "Umsatz pro Quartal (gestapelt)" },
      scales: { xAxes: [{ stacked: true }], yAxes: [{ stacked: true }] },
      legend: { display: true }
    }
  },

  {
    id: "stats-4",
    type: "line",
    labels: getWeeksArray(15, 5),
    datasets: [{
      label: "Active Users",
      borderColor: "#a78bfa",
      data: [120, 130, 140, 160, 155, 170, 165, 180, 190, 200, 195, 210, 220, 230, 240],
      pointRadius: 2,
      fill: false,
    }],
    options: { title: { display: true, text: "Active Users (Mai)" }, elements: { line: { tension: 0.25 } } }
  },

  {
    id: "stats-5",
    type: "bar",
    labels: ["Berlin", "Hamburg", "München", "Köln"],
    datasets: [{
      label: "Leads",
      backgroundColor: ["#34d399","#60a5fa","#f472b6","#f59e0b"],
      data: [320, 280, 390, 260]
    }],
    options: { title: { display: true, text: "Leads nach Stadt" } }
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
