import { html } from "./preact-htm.js";
import { useState, useEffect } from "./preact-htm.js";

const BASE_URL =
  "https://raw.githubusercontent.com/kristinbaumann/kit-participation-research-website/refs/heads/main/assets";

const rawColors = ["#80C3B5", "#ACDFF4", "#D3C096"];
const colors = {
  "KIT researchers": rawColors[0],
  "KIT policy level": rawColors[1],
  "Participants in citizen dialogues": rawColors[2],
};

export default function Matrix() {
  const [data, setData] = useState(null);
  const [level1, setLevel1] = useState(null);
  const [level2, setLevel2] = useState(null);
  const [level3, setLevel3] = useState(null);
  const [level4, setLevel4] = useState(null);

  useEffect(() => {
    d3.dsv(";", BASE_URL + "/data/matrix_data_221121.csv").then((data) => {
      console.log("Raw data loaded:", data);

      // process data
      let processedData = data.map((d) => ({
        id: d["ID"],
        stakeholder: d["Stakeholder"],
        impactLevel: d["Impact level"],
        impact: d["Impact"],
        impactIndicator: d["Impact indicators SHORT"],
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

  // console.log("Matrix data loaded:", data);
  useEffect(() => {
    setLevel2(null);
    setLevel3(null);
    setLevel4(null);
  }, [level1]);

  useEffect(() => {
    setLevel3(null);
    setLevel4(null);
  }, [level2]);

  useEffect(() => {
    setLevel4(null);
  }, [level3]);

  // get unique level 1 options from data as "stakeholder"
  const level1Key = "stakeholder";
  const level1Options = Array.from(new Set(data.map((d) => d[level1Key])));
  // sort level1Options based on rawColors order
  level1Options.sort(
    (a, b) => Object.keys(colors).indexOf(a) - Object.keys(colors).indexOf(b)
  );

  const level2Key = "impactLevel";
  const level2Options = level1
    ? Array.from(
        new Set(
          data.filter((d) => d[level1Key] === level1).map((d) => d[level2Key])
        )
      )
    : null;

  const level3Key = "impact";
  const level3Options =
    level1 && level2
      ? Array.from(
          new Set(
            data
              .filter((d) => d[level1Key] === level1 && d[level2Key] === level2)
              .map((d) => d[level3Key])
          )
        )
      : null;

  const level4Key = "impactIndicator";
  const level4Options =
    level1 && level2 && level3
      ? Array.from(
          new Set(
            data
              .filter(
                (d) =>
                  d[level1Key] === level1 &&
                  d[level2Key] === level2 &&
                  d[level3Key] === level3
              )
              .map((d) => d[level4Key])
          )
        )
      : null;
  const detailItem =
    level1 && level2 && level3 && level4
      ? data.find(
          (d) =>
            d[level1Key] === level1 &&
            d[level2Key] === level2 &&
            d[level3Key] === level3 &&
            d[level4Key] === level4
        )
      : null;

  return html`<div style="font-family: Roboto; padding: 10px;">
    <style>
      .box .box-content {
        opacity: 0.6;
      }
      .box:hover .box-content {
        opacity: 0.8;
      }
      @media (max-width: 768px) {
        .box span {
          padding-right: 0px;
        }
        .box img {
          height: 40px;
        }
      }
    </style>
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
    <div
      style="display: flex; gap: 28px; flex-wrap: wrap; width: 90%; margin: 20px auto 0 auto;"
    >
      ${level2Options &&
      level2Options.map(
        (option) =>
          html`
            <${Box}
              type="${level2Key.replace("impactLevel", "impact level")}"
              item=${option}
              color=${colors[level1]}
              active=${level2 === option}
              onClick=${() => setLevel2(option)}
            />
          `
      )}
    </div>
    <div
      style="display: flex; gap: 28px; flex-wrap: wrap; width: 80%; margin: 20px auto 20px auto;"
    >
      ${level3Options &&
      level3Options.map(
        (option) =>
          html`
            <${Box}
              type="${level3Key}"
              item=${option}
              color=${colors[level1]}
              active=${level3 === option}
              onClick=${() => setLevel3(option)}
            />
          `
      )}
    </div>
    <div
      style=" display: flex; flex-direction: row; gap: 12px; width: 70%; margin-left: auto; margin-right: auto;"
    >
      ${level4Options &&
      level4Options.length > 0 &&
      html`<div style="flex: 1;">
        <p style="text-transform: uppercase; margin: 0;font-size: 15px;">
          Indicators
        </p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${level4Options &&
          level4Options.map(
            (option) =>
              html`
                <${Box}
                  type="${level4Key}"
                  item=${option}
                  color=${colors[level1]}
                  active=${level4 === option}
                  onClick=${() => setLevel4(option)}
                  withIllustration=${false}
                  withTypeLabel=${false}
                />
              `
          )}
        </div>
      </div>`}
      ${level4 && detailItem
        ? html`<div
            style="flex: 1; background-color: ${colors[
              level1
            ]}; padding: 20px; margin-top: 21px;"
          >
            <p style="text-transform: uppercase; font-size: 15px; margin: 0;">
              Indicator (In detail)
            </p>
            <p
              style="font-weight: bold; font-size: 19px; line-height: 1.25; margin-top: 0; margin-bottom: 18px;"
            >
              ${detailItem.impactIndicator}
            </p>
            <p
              style="font-weight: bold; font-size: 19px; line-height: 1.25; padding-bottom: 18px; margin-bottom: 18px; border-bottom: 1px solid black;"
            >
              ${detailItem.impactDescription.replaceAll("<br>", " ")}
            </p>
            <p style="text-transform: uppercase; font-size: 15px; margin: 0;">
              Stakeholder
            </p>
            <p
              style="font-weight: bold; font-size: 19px; line-height: 1.25; margin-top: 0; padding-bottom: 18px; margin-bottom: 18px; border-bottom: 1px solid black;"
            >
              ${detailItem.stakeholder}
            </p>
            <p style="text-transform: uppercase; font-size: 15px; margin: 0;">
              Impact Level
            </p>
            <p
              style="font-weight: bold; font-size: 19px; line-height: 1.25; margin-top: 0; padding-bottom: 18px; margin-bottom: 18px; border-bottom: 1px solid black;"
            >
              ${detailItem.impactLevel}
            </p>
            <p style="text-transform: uppercase; font-size: 15px; margin: 0;">
              Impact
            </p>
            <p
              style="font-weight: bold; font-size: 19px; line-height: 1.25; margin-top: 0; padding-bottom: 18px; margin-bottom: 18px; border-bottom: 1px solid black;"
            >
              ${detailItem.impact}
            </p>
            <p style="text-transform: uppercase; font-size: 15px; margin: 0;">
              Impact Source
            </p>
            <p
              style="font-weight: bold; font-size: 19px; line-height: 1.25; margin-top: 0; margin-bottom:0; padding-bottom: 18px; border-bottom: 1px solid black;"
            >
              ${detailItem.impactSource}
            </p>
          </div>`
        : html`<div style="flex:1; padding: 20px; "></div>`}
    </div>
  </div>`;
}

function Box({
  type,
  item,
  color,
  active,
  onClick,
  withIllustration = true,
  withTypeLabel = true,
}) {
  const [state, setState] = useState(active ? "active_hover" : "default");

  const formattedType = type.toLowerCase().replace(/\s+/g, "_");
  let formattedItem =
    item.includes("(for researchers)") || item.includes("(for participants)")
      ? item
          .toLowerCase()
          .replace("(", "")
          .replace(")", "")
          .replace(/\s+/g, "_")
      : item
          .toLowerCase()
          .replace(/\([^)]*\)/g, "")
          .replace(/\s+/g, "_");
  if (formattedItem.endsWith("_")) {
    formattedItem = formattedItem.slice(0, -1);
  }
  const imageFileName = `${formattedType}_${formattedItem}_${state}.svg`;

  useEffect(() => {
    setState(active ? "active_hover" : "default");
  }, [active]);

  return html`<div
    class="box"
    style="flex: 1 1 0; display: flex; flex-direction: column;"
    onMouseEnter=${() => {
      setState("active_hover");
    }}
    onMouseLeave=${() => {
      if (!active) {
        setState("default");
      }
    }}
  >
    ${withTypeLabel &&
    html`<p style="text-transform: uppercase; margin: 0;font-size: 15px;">
      ${type}
    </p>`}
    <div
      class="box-content"
      style="border: 1px solid black; padding: 5px 10px; background-color: ${color}; position: relative; cursor: pointer; transition: all 0.3s ease; flex: 1; display:flex; align-items: center; ${active
        ? "opacity: 1;"
        : ""}"
      onClick=${onClick}
    >
      <span style="font-size: 19px; font-weight: bold; padding-right: 80px;"
        >${item}</span
      >
      ${withIllustration &&
      html`<img
        src="${BASE_URL}/illustrations/${imageFileName}"
        style="position: absolute; right:6px; bottom:0; transition: all 0.3s ease;"
      />`}
    </div>
  </div>`;
}
