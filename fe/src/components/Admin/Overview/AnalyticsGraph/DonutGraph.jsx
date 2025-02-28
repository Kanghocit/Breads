import { ArcElement, Chart } from "chart.js";
import { useEffect } from "react";

Chart.register(ArcElement);

const DoughnutGraph = () => {
  useEffect(() => {
    displayData();
  }, []);

  const displayData = () => {
    const data = {
      labels: ["Red", "Blue", "Yellow"],
      datasets: [
        {
          label: "My First Dataset",
          data: [300, 50, 100],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    };
    const config = {
      type: "doughnut",
      data: data,
    };
    new Chart(
      document.getElementById("doughnut-graph").getContext("2d"),
      config
    );
  };
  return <canvas id="doughnut-graph" />;
};

export default DoughnutGraph;
