import { html } from "./preact-htm.js";
import { useState, useEffect } from "./preact-htm.js";

export default function Matrix() {
  const [data, setData] = useState(null);

  useEffect(() => {
    d3.dsv(
      ";",
      "https://raw.githubusercontent.com/kristinbaumann/kit-participation-research-website/refs/heads/main/assets/data/matrix_data_221121.csv"
    ).then((data) => {
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

  return html`<div>Matrix with ${data.length} rows</div>`;
}
