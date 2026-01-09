// Daten/Configs
const chartsConfig = [
  {
    id: "stats-0",
    type: "line",
    labels: getWeeksArray(30, 3),
    datasets: [{
      label: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
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
  },
  
{
  id: "stats-2",
  type: "line",
  labels: getWeeksArray(30, 3),
  datasets: [
    {
      label: "Visits",
      borderColor: "rgba(174,155,255,0.67)",
      backgroundColor: "rgba(174,155,255,0.2)",
      data: [
        120, 140, 160, 180, 200, 220, 210, 230, 250, 270,
        260, 280, 300, 320, 310, 330, 350, 370, 360, 380,
        400, 420, 410, 430, 450, 470, 460, 480, 500, 520
      ],
      pointRadius: 4,
      borderWidth: 2,
      fill: false
    },
    {
      label: "Conversions",
      borderColor: "rgba(255,99,132,0.8)",
      backgroundColor: "rgba(255,99,132,0.2)",
      data: [
        80, 90, 100, 120, 130, 140, 150, 160, 170, 180,
        190, 200, 210, 220, 230, 240, 250, 260, 270, 280,
        290, 300, 310, 320, 330, 340, 350, 360, 370, 380
      ],
      pointRadius: 4,
      borderWidth: 2,
      fill: false
    }
  ]
},
]; 
// Basisoptionen (Chart.js 4.5)
const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  elements: { line: { tension: 0 } },
  plugins: {
    legend: { display: false },
    title: { display: false, text: "Chart" }
  },
  scales: {
    x: { ticks: { color: "#444363", font: { size: 12 } }, grid: { color: "rgba(0, 0, 0, 0.1)" } },
    y: { ticks: { color: "#444363", font: { size: 12 } }, grid: { color: "rgba(0, 0, 0, 0.1)" } }
  }
}; 
// Charts erzeugen (nachdem DOM geladen ist)
document.addEventListener('DOMContentLoaded', () => {
  chartsConfig.forEach(cfg => {
    const canvas = document.getElementById(cfg.id);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");   
    new Chart(ctx, {
      type: cfg.type,
      data: { labels: cfg.labels, datasets: cfg.datasets },
      options: baseOptions
    });
  });
});
