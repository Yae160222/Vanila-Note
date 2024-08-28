let Board = document.getElementById("Board-0");
let LeftBar = document.getElementById("LeftBar");
let createButton = document.getElementById("createButton");
let color = document.getElementById("color");
let imageInput = document.getElementById("imageInput");
let saveBtn = document.getElementById("saveButton");
let verticalSection = document.getElementById("VerticalSection");

let cursor = {
  x: null,
  y: null,
};
let element = {
  dom: null,
  x: null,
  y: null,
};
let editMode = false;

document.addEventListener("auxclick", (event) => {
  const elements = document.querySelectorAll(".note");
  for (const ele of elements) {
    console.log("element-> ", ele);
  }
});

document.addEventListener("dblclick", (event) => {
  if (event.target.classList.contains("resizable")) {
    editMode = !editMode;
    event.target.style.borderRight = editMode ? "3px solid blue" : "";
    event.target.style.borderBottom = editMode ? "3px solid blue" : "";
    event.target.style.cursor = editMode ? "se-resize" : "auto";
  }
});

document.addEventListener("mousedown", (event) => {
  if (event.target.classList.contains("movable")) {
    if (!editMode) {
      cursor = {
        x: event.clientX,
        y: event.clientY,
      };
      element = {
        dom: event.target,
        x:
          event.target.getBoundingClientRect().left -
          Board.getBoundingClientRect().left,
        y:
          event.target.getBoundingClientRect().top -
          Board.getBoundingClientRect().top,
      };
      element.dom.style.cursor = "grab";
    }
  }
  if (event.target.classList.contains("resizable") && editMode) {
    cursor = {
      x: event.clientX,
      y: event.clientY,
    };
    element = {
      dom: event.target,
      initialWidth: parseInt(getComputedStyle(event.target).width, 10),
      initialHeight: parseInt(getComputedStyle(event.target).height, 10),
    };
  }
});

document.addEventListener("mousemove", (event) => {
  if (element.dom == null) return;
  let currentCurosr = {
    x: event.clientX,
    y: event.clientY,
  };
  let distance = {
    x: currentCurosr.x - cursor.x,
    y: currentCurosr.y - cursor.y,
  };
  if (!editMode) {
    element.dom.style.left = element.x + distance.x + `px`;
    element.dom.style.top = element.y + distance.y + `px`;
  } else {
    element.dom.style.width = `${element.initialWidth + distance.x}px`;
    element.dom.style.height = `${element.initialHeight + distance.y}px`;
  }
});

document.addEventListener("mouseup", (event) => {
  if (element.dom == null) return;
  if (element.dom.classList.contains("Image")) {
    const elementsList = document.elementsFromPoint(
      event.clientX,
      event.clientY
    );
    for (let domElement of elementsList) {
      if (domElement.classList.contains("note")) {
        addImage(element.dom.src, domElement);
        element.dom.remove();
        break;
      }
    }
  }
  element.dom.style.cursor = "auto";
  element.dom = null;
});

saveBtn.onclick = async () => {
  const boards = document.querySelectorAll(".Board");
  const data = [];
  for (const board of boards) {
    data.push(board.innerHTML);
  }
  console.log(data);
  const jsonData = {
    data: data,
  };
  const response = await fetch(`http://localhost:5000/saveData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  });
  const res = await response.text();
  alert(res);
};

imageInput.onchange = async () => {
  const base64Image = await getBase64(imageInput.files[0]);
  console.log("base64 ->", base64Image);
  addImage(base64Image);
};

createButton.onclick = () => {
  let newNote = document.createElement("div");
  newNote.classList.add("note");
  newNote.classList.add("movable");
  newNote.classList.add("resizable");
  newNote.innerHTML = `
    <span class="close">X</span>
    <div class="ContentHolder"></div>`;
  newNote.style.borderColor = color.value;
  Board.appendChild(newNote);
};

async function initilizeApp() {
  const response = await fetch("http://localhost:5000/getAppData");
  const data = await response.json();
  const appData = data[0];
  const boards = appData.boards;

  console.log(boards);
  const firstBoard = document.createElement("div");
  firstBoard.classList.add("Board");
  firstBoard.id = `Board-0`;
  firstBoard.style.visibility = "visible";
  firstBoard.innerHTML = boards[0];
  verticalSection.appendChild(firstBoard);
  Board = document.getElementById("Board-0");
  for (let i = 1; i < boards.length; i++) {
    const newBoard = document.createElement("div");
    newBoard.classList.add("Board");
    newBoard.id = `Board-${i}`;
    newBoard.style.visibility = "hidden";
    newBoard.innerHTML = boards[i];
    verticalSection.appendChild(newBoard);
  }
}

function addImage(image, element) {
  let newImage = document.createElement("img");
  newImage.classList.add("movable");
  newImage.classList.add("resizable");
  newImage.classList.add("Image");
  newImage.src = image;
  if (element) {
    const contentHolder = element.querySelector(".ContentHolder");
    if (contentHolder) {
      newImage.style.position = "unset";
      newImage.style.width = "100%";
      newImage.style.height = "auto";
      contentHolder.appendChild(newImage);
      element.style.height = "auto";
      element.style.width = "auto";
    } else {
      console.log("ContentHolder not found in element");
    }
  } else {
    Board.appendChild(newImage);
  }
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

initilizeApp();
