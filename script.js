console.log("Vis embedding script loaded.");

import { html, renderComponent } from "./js/preact-htm.js";
import Matrix from "./js/Matrix.js";

// Insert after a specified number of children
function insertContainerInPage() {
  const containerDiv = createContainerDiv();
  const afterChildren = 1;
  const mainElement = document.querySelector("#main_content .content");
  const targetChild = mainElement.children[afterChildren];
  if (targetChild) {
    mainElement.insertBefore(containerDiv, targetChild);
  } else {
    mainElement.appendChild(containerDiv);
  }
}

function createContainerDiv() {
  const containerDiv = document.createElement("div");
  containerDiv.id = "matrix_visualization_container";
  containerDiv.style.width = "100%";
  containerDiv.className = "full"; // to make it span the full width in OpenText
  return containerDiv;
}

function renderVis() {
  const containerElement = document.getElementById(
    "matrix_visualization_container"
  );
  if (containerElement) {
    // console.log("Rendering Matrix visualization...");
    renderComponent(html`<${Matrix} />`, containerElement);
  } else {
    console.error(
      `Could not find container element for vis with id "matrix_visualization_container"`
    );
  }
}

insertContainerInPage();
renderVis();
