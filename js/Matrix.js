import { html } from "./preact-htm.js";
import { useState, useEffect } from "./preact-htm.js";

const BASE_URL =
  "https://raw.githubusercontent.com/kristinbaumann/kit-participation-research-website/refs/heads/main/assets";

const rawColors = ["#80C3B5", "#ACDFF4", "#D3C096"];

export default function Matrix() {
  const [data, setData] = useState(null);
  const [level1, setLevel1] = useState(null);

  useEffect(() => {
    d3.dsv(";", BASE_URL + "/data/matrix_data_221121.csv").then((data) => {
      console.log("Raw data loaded:", data);

      // process data
      let processedData = data.map((d) => ({
        id: d["ID"],
        stakeholder: d["Stakeholder"],
        impactLevel: d["Impact level"],
        impact: d["Impact"],
        impactIndicators: d["Impact indicators SHORT"],
        impactSource: d["Impact source"],
        impactDescription: d["Impact description"],
      }));

      // filter out rows with empty 'id' field
      processedData = processedData.filter((d) => d.id && d.id.trim() !== "");

      setData(processedData);
    });
  }, []);

  if (!data) {
    return html`<div>Loading matrix data...</div>`;
  }

  console.log("Matrix data loaded:", data);

  // get unique level 1 options from data as "stakeholder"
  const level1Key = "stakeholder";
  const level1Options = Array.from(new Set(data.map((d) => d[level1Key])));
  const colors = level1Options.reduce(
    (acc, option, i) => ({
      ...acc,
      [option]: rawColors[i % rawColors.length],
    }),
    {}
  );

  return html`<div style="font-family: Roboto; padding: 10px;">
    <p>Matrix with ${data.length} rows</p>
    <div style="display: flex; gap: 28px; flex-wrap: wrap; width: 100%;">
      ${level1Options.map(
        (option) =>
          html`
            <${Box}
              type="${level1Key}"
              item=${option}
              color=${colors[option]}
              active=${level1 === option}
              onClick=${() => setLevel1(option)}
            />
          `
      )}
    </div>
  </div>`;
}

function Box({ type, item, color, active, onClick }) {
  const [state, setState] = useState(active ? "active_hover" : "default");

  const imageFileName = `${type.toLowerCase()}_${item
    .toLowerCase()
    .replace(/\s+/g, "_")}_${state}.svg`;
  return html`<div
    class="box"
    style="flex-grow: 1;"
    onMouseEnter=${() => {
      setState("active_hover");
    }}
    onMouseLeave=${() => {
      setState("default");
    }}
  >
    <p style="text-transform: uppercase; margin: 0;">${type}</p>
    <div
      style="border: 1px solid black; padding: 10px; background-color: ${color}; position: relative; cursor: pointer; transition: all 0.3s ease; ${active
        ? ""
        : "opacity: 0.7;"}"
      onClick=${onClick}
    >
      <span style="font-size: 19px; font-weight: bold; padding-right: 80px;"
        >${item}</span
      >
      <img
        src="${BASE_URL}/illustrations/${imageFileName}"
        style="position: absolute; right:6px; bottom:0; transition: all 0.3s ease;"
      />
    </div>
  </div>`;
}
