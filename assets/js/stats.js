document.querySelectorAll('canvas.chart').forEach(canvas => {
  const cfg = JSON.parse(canvas.dataset.chart);

  const hasBar = cfg.datasets.some(ds => ds.type === 'bar');

  const datasets = cfg.datasets.map(ds => ({
    type: ds.type,
    label: ds.label,
    data: ds.data,
    backgroundColor: ds.color,
    borderColor: ds.color,
    borderWidth: ds.type === 'bar' ? 0 : 2
  }));

  new Chart(canvas, {
    type: 'line', // Base-Type für Mixed Charts
    data: {
      labels: cfg.labels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          offset: hasBar   // ✅ automatisch nur bei Bar
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
});

