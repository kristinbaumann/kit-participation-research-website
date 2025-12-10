console.log("Test from script embed");

const newDiv = document.createElement("div");
newDiv.style.padding = "20px";
newDiv.style.marginBottom = "20px";
newDiv.style.border = "2px solid #000";
newDiv.style.gridColumn = "span 12";
newDiv.style.width = "auto";
newDiv.style.maxWidth = "100%";
newDiv.innerText = "Container for matrix visualization";

// Insert after a specified number of children
const afterChildren = 1;
const mainElement = document.querySelector("#main_content .content");
const targetChild = mainElement.children[afterChildren];
if (targetChild) {
  mainElement.insertBefore(newDiv, targetChild);
} else {
  mainElement.appendChild(newDiv);
}
