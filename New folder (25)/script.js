const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  ctx = canvas.getContext("2d");

let prevMouseX,
  prevMouseY,
  snapshot,
  isDrawing = false,
  selectedTool = "brush",
  brushWidth = 5;

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

const drawRect = (e) => {
  if (fillColor.checked) {
    return ctx.fillRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  ctx.strokeRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};
const drawCircle = (e) => {
  ctx.beginPath(); // getting radius for circle according to the mouse pointer
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
};

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath(); // closing path of a triangle so third line draw automatically
  fillColor.checked ? ctx.fill() : ctx.stroke();
};
const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX; //passing current mouseX position as prevMouseX value
  prevMouseY = e.offsetY; //passing current mouseX position as prevMouseY value
  ctx.beginPath(); // create new path to draw
  ctx.lineWidth = brushWidth;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);

  if (selectedTool === "brush") {
    ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the pointer
    ctx.stroke(); // drawing/ filling line with color
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else {
    drawTriangle(e);
  }
};

toolBtns.forEach((btn) => {
  // adding click event to all tool option
  btn.addEventListener("click", () => {
    // remove active class form the previous and adding on current clicked option
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    console.log(selectedTool);
  });
});

sizeSlider.addEventListener("change", () => {
  brushWidth = sizeSlider.value; // passing slider value as brushSize
});

colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    console.log(btn);
  });
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});
