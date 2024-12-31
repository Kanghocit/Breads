import { Chart } from "chart.js";
import * as ChartGeo from "chartjs-chart-geo";
import {
  ChoroplethController,
  ColorScale,
  GeoFeature,
  ProjectionScale,
} from "chartjs-chart-geo";
import { useEffect, useState } from "react";

Chart.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale);

const MapGraph = () => {
  const [mapData, setMapData] = useState();

  const fetchWorldAtlasData = async () => {
    const url = "https://unpkg.com/world-atlas/countries-50m.json";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMapData(data);
      return data;
    } catch (error) {
      console.error("Error fetching world atlas data:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchWorldAtlasData();
  }, []);

  if (!!mapData) {
    const countries = ChartGeo.topojson.feature(
      mapData,
      mapData.objects.countries
    ).features;
    new Chart(document.getElementById("map-graph").getContext("2d"), {
      type: "choropleth",
      data: {
        labels: countries.map((d) => d.properties.name),
        datasets: [
          {
            label: "Countries",
            data: countries.map((d) => ({
              feature: d,
              value: Math.random(),
            })),
          },
        ],
      },
      options: {
        showOutline: true,
        showGraticule: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          projection: {
            axis: "x",
            projection: "equalEarth",
          },
        },
      },
    });
  }

  return <canvas id="map-graph"></canvas>;
};

export default MapGraph;
