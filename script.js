console.log("Test from script embed");
const mainElement = document.querySelector("#main_content .content");
const newDiv = document.createElement("div");
newDiv.style.padding = "20px";
newDiv.style.border = "2px solid #000";
newDiv.innerText = "Test div";
mainElement.appendChild(newDiv);
