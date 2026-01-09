
function getWeeksArray(count = 30, month = 3) {
  const labels = [];
  for (let i = 0; i < count; i++) {
    labels.push(`${month}/${i}`);
  }
  return labels;
}

function randomArray(length, max) {
  return Array.from({ length }, () => Math.round(Math.random() * max));
}

// Hilfsfarben
const purple = "rgba(174,155,255,0.67)";
const purplePoint = "#AE9BFF";
const purpleBg = "#C0B2FC";

const chartsConfig = [
  // 0: Line, 30 Punkte, andere Labels
  {
    id: "stats-0",
    type: "line",
    labels: getWeeksArray(30, 3),
    datasets: [{
      label: "Visits",
      borderColor: purple,
      pointBackgroundColor: purpleBg,
      pointBorderColor: purplePoint,
      data: randomArray(30, 1000),
      pointRadius: 4,
      borderWidth: 1,
      fill: true,
    }],
  },

  // 1: Bar, andere Datenlänge
  {
    id: "stats-1",
    type: "bar",
    labels: ["Mo","Di","Mi","Do","Fr","Sa","So"],
    datasets: [{
      label: "Sales",
      backgroundColor: purple,
      data: randomArray(7, 250),
    }],
    options: { title: { display: true, text: "Sales pro Wochentag" } }
  },

  // 2: Line mit 2 Datasets (Vergleich)
  {
    id: "stats-2",
    type: "line",
    labels: getWeeksArray(20, 4),
    datasets: [
      {
        label: "Signups",
        borderColor: "#4ade80", // green
        data: randomArray(20, 200),
        pointRadius: 0,
        fill: false,
      },
      {
        label: "Churn",
        borderColor: "#ef4444", // red
        data: randomArray(20, 100),
        pointRadius: 0,
        fill: false,
      }
    ],
    options: { title: { display: true, text: "Signups vs Churn (April, 20 Tage)" }, legend: { display: true } }
  },

  // 3: Bar mit gestapelten Daten
  {
    id: "stats-3",
    type: "bar",
    labels: ["Q1","Q2","Q3","Q4"],
    datasets: [
      { label: "Product A", backgroundColor: "#60a5fa", data: [120, 180, 160, 200] },
      { label: "Product B", backgroundColor: "#f59e0b", data: [80, 90, 110, 130] },
    ],
    options: {
      title: { display: true, text: "Umsatz pro Quartal (gestapelt)" },
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [{ stacked: true }]
      },
      legend: { display: true }
    }
  },

  // 4: Line mit geglätteter Kurve (falls du willst)
  {
    id: "stats-4",
    type: "line",
    labels: getWeeksArray(15, 5),
    datasets: [{
      label: "Active Users",
      borderColor: "#a78bfa",
      data: randomArray(15, 500),
      pointRadius: 2,
      fill: false,
    }],
    options: {
      title: { display: true, text: "Active Users (Mai, 15 Tage)" },
      elements: { line: { tension: 0.25 } } // kleine Glättung
    }
  },

  // 5: Bar mit eigenem Farbschema
  {
    id: "stats-5",
    type: "bar",
    labels: ["Berlin", "Hamburg", "München", "Köln"],
    datasets: [{
      label: "Leads",
      backgroundColor: ["#34d399","#60a5fa","#f472b6","#f59e0b"],
      data: [320, 280, 390, 260],
    }],
    options: { title: { display: true, text: "Leads nach Stadt" } }
  },
];

// Standardoptionen (werden gemerged)
const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  legend: { display: false },
  elements: { line: { tension: 0 } },
  scales: {
    yAxes: [{ ticks: { fontColor: "#444363", fontSize: 12 } }],
    xAxes: [{ ticks: { fontColor: "#444363", fontSize: 12 } }],
  }
};

// Charts instanziieren
chartsConfig.forEach(cfg => {
  const ctx = document.getElementById(cfg.id)?.getContext("2d");
  if (!ctx) return;

  const options = {
    ...baseOptions,
    ...(cfg.options || {}),
  };

  new Chart(ctx, {
    type: cfg.type,
    data: { labels: cfg.labels, datasets: cfg.datasets },
    options,
  });
});
``
