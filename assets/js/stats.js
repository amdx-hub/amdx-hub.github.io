const CHART_COLORS = {
  borderColor: "rgba(174,155,255,0.67)",
  backgroundColor: "rgba(174,155,255,0.67)", // helle Balken
  pointBackgroundColor: "#C0B2FC",
  pointBorderColor: "#AE9BFF"
};

document.querySelectorAll('canvas.chart').forEach(canvas => {
  const cfg = JSON.parse(canvas.dataset.chart);

  // prüfen, ob ein Bar-Dataset existiert
  const hasBar = cfg.datasets.some(ds => ds.type === 'bar');

  const datasets = cfg.datasets.map(ds => {
    const isBar = ds.type === 'bar';

    return {
      type: ds.type,
      label: ds.label,
      data: ds.data,

      // Balken
      ...(isBar && {
        backgroundColor: CHART_COLORS.backgroundColor,
        borderColor: CHART_COLORS.borderColor,
        borderWidth: 1
      }),

      // Linie
      ...(!isBar && {
        borderColor: CHART_COLORS.borderColor,
        pointBackgroundColor: CHART_COLORS.pointBackgroundColor,
        pointBorderColor: CHART_COLORS.pointBorderColor,
        tension: 0.3,
        pointRadius: 4,
        borderWidth: 1,
        fill: true
      })
    };
  });

  new Chart(canvas, {
    type: 'line', // Base-Type für Mixed Charts
    data: {
      labels: cfg.labels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // passt sich der Parent-Höhe an
      plugins: {
        legend: {
          display: false   // ✅ Legende ausblenden
        }
      },
      scales: {
        x: {
          offset: hasBar,
          ticks: {
            color: "#444363",
            font: { size: 12 }
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "#444363",
            font: { size: 12 }
          }
        }
      }
    }
  });
});
