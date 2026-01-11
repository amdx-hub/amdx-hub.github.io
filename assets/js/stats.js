// ===============================
// Farb-Presets
// ===============================
const CHART_COLORS = {
  primary: {
    border: "rgba(174,155,255,0.67)",
    bg: "rgba(174,155,255,0.2)",
    pointBg: "#C0B2FC",
    pointBorder: "#AE9BFF"
  },
  secondary: {
    border: "rgba(239,68,68,0.8)",
    pointBg: "#FCA5A5",
    pointBorder: "#EF4444"
  }
};

// ===============================
// Charts initialisieren
// ===============================
document.querySelectorAll('canvas.chart').forEach(canvas => {
  const cfg = JSON.parse(canvas.dataset.chart);

  // Prüfen, ob Bars vorhanden sind
  const hasBar = cfg.datasets.some(ds => ds.type === 'bar');

  // Zähler für Line-Datasets (für alternative Farbe)
  let lineIndex = 0;

  const datasets = cfg.datasets.map(ds => {
    const isBar = ds.type === 'bar';
    const isLine = ds.type === 'line';

    if (isLine) lineIndex++;

    // 1. Linie = primary, 2.+ Linie = secondary
    const colors =
      isLine && lineIndex > 1
        ? CHART_COLORS.secondary
        : CHART_COLORS.primary;

    return {
      type: ds.type,
      label: ds.label,
      data: ds.data,

      // ===============================
      // Balken
      // ===============================
      ...(isBar && {
        backgroundColor: CHART_COLORS.primary.bg,
        borderColor: CHART_COLORS.primary.border,
        borderWidth: 1
      }),

      // ===============================
      // Linien
      // ===============================
      ...(isLine && {
        borderColor: colors.border,
        pointBackgroundColor: colors.pointBg,
        pointBorderColor: colors.pointBorder,
        tension: 0.3,
        fill: false
      })
    };
  });

  // ===============================
  // Chart erstellen
  // ===============================
  new Chart(canvas, {
    type: 'line', // Base-Type für Mixed Charts
    data: {
      labels: cfg.labels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      // ===============================
      // Plugins
      // ===============================
      plugins: {
        legend: {
          display: false
        }
      },

      // ===============================
      // Skalen
      // ===============================
      scales: {
        x: {
          offset: hasBar
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
});
