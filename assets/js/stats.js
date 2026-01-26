const CHART_COLORS = {
  trading: {
    borderColor: "rgba(174,155,255,0.9)",
    pointBackgroundColor: "#C0B2FC",
    pointBorderColor: "#AE9BFF"
  },
  hodl: {
    borderColor: "rgba(120,180,255,0.9)",
    pointBackgroundColor: "#7AB4FF",
    pointBorderColor: "#7AB4FF"
  },
  drawdown: {
    backgroundColor: "rgba(239,68,68,0.45)",
    borderColor: "rgba(239,68,68,0.8)"
  }
};

document.querySelectorAll("canvas.chart").forEach(canvas => {
  const cfg = JSON.parse(canvas.dataset.chart);

  const hasBar = cfg.datasets.some(ds => ds.type === "bar");

  const datasets = cfg.datasets.map(ds => {
    const isBar = ds.type === "bar";
    const isHodl = ds.label?.toLowerCase().includes("hodl");

    return {
      type: ds.type,
      label: ds.label,
      data: ds.data,
      yAxisID: ds.yAxisID || "equity",

      // Drawdown (Bar)
      ...(isBar && {
        backgroundColor: CHART_COLORS.drawdown.backgroundColor,
        borderColor: CHART_COLORS.drawdown.borderColor,
        borderWidth: 1
      }),

      // Trading / HODL (Line)
      ...(!isBar && {
        borderColor: isHodl
          ? CHART_COLORS.hodl.borderColor
          : CHART_COLORS.trading.borderColor,

        pointBackgroundColor: isHodl
          ? CHART_COLORS.hodl.pointBackgroundColor
          : CHART_COLORS.trading.pointBackgroundColor,

        pointBorderColor: isHodl
          ? CHART_COLORS.hodl.pointBorderColor
          : CHART_COLORS.trading.pointBorderColor,

        tension: 0.3,
        pointRadius: 3,
        borderWidth: 2,
        fill: false,
        borderDash: isHodl ? [6, 4] : undefined
      })
    };
  });

  new Chart(canvas, {
    type: "line",
    data: {
      labels: cfg.labels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        mode: "index",
        intersect: false
      },

      plugins: {
        legend: {
          display: true
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

        equity: {
          type: "linear",
          position: "left",
          ticks: {
            callback: v => v + "%",
            color: "#444363",
            font: { size: 12 }
          },
          grid: {
            drawOnChartArea: false
          }
        },

        drawdown: {
          type: "linear",
          position: "right",
          ticks: {
            callback: v => v + "%",
            color: "#EF4444",
            font: { size: 12 }
          }
        }
      }
    }
  });
});
