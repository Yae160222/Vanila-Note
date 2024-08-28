const svgContainer = document.getElementById("drawingArea");
const saveBtn = document.getElementById("saveBtn");
const container = document.getElementById("container");
let isDrawing = false;
let path;

svgContainer.addEventListener("mousedown", (event) => {
  isDrawing = true;

  // Start a new path element
  path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "black");
  path.setAttribute("stroke-width", "2");
  svgContainer.appendChild(path);

  // Start the path with the mouse's current position
  const { x, y } = getMousePosition(event);
  path.setAttribute("d", `M ${x} ${y}`);
});

svgContainer.addEventListener("mousemove", (event) => {
  if (!isDrawing) return;

  const { x, y } = getMousePosition(event);
  const d = path.getAttribute("d");
  path.setAttribute("d", `${d} L ${x} ${y}`);
});

svgContainer.addEventListener("mouseup", () => {
  isDrawing = false;
});

svgContainer.addEventListener("mouseleave", () => {
  isDrawing = false;
});

function getMousePosition(event) {
  const rect = svgContainer.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

saveBtn.addEventListener("click", () => {
  // Clone the current SVG element
  const svgClone = svgContainer.cloneNode(true);

  // Create a new div to hold the cloned SVG
  const svgWrapper = document.createElement("div");
  svgWrapper.style.marginBottom = "10px";
  svgWrapper.appendChild(svgClone);

  // Append the cloned SVG to the container
  container.appendChild(svgWrapper);

  // Optionally, you can clear the original SVG after saving
  svgContainer.innerHTML = "";
});
