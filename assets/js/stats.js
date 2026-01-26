document.addEventListener("DOMContentLoaded", () => {
  if (typeof echarts === "undefined") return;

  document.querySelectorAll(".echart").forEach((el) => {
    const data = JSON.parse(el.dataset.chart);

    const option = {
      tooltip: { trigger: "axis" },

      legend: {
        top: 0
      },

      xAxis: {
        type: "category",
        data: data.labels
      },

      yAxis: [
        {
          type: "value",
          name: "Equity",
          position: "left"
        },
        {
          type: "value",
          name: "Drawdown",
          position: "right"
        }
      ],

      series: data.datasets.map(ds => ({
        type: ds.type,
        name: ds.name,
        data: ds.data,
        yAxisIndex: ds.yAxis === "drawdown" ? 1 : 0,
        smooth: ds.type === "line"
      }))
    };

    const chart = echarts.init(el);
    chart.setOption(option);

    window.addEventListener("resize", () => chart.resize());
  });
});
