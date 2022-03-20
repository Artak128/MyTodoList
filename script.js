let data = [];
let indexForRender = "All";

////////////////// Helper Functions //////////////////////////////////

function todoCreatorForRender(params) {
  let element = document.querySelector(".hidden").cloneNode(true);
  element.classList.remove("hidden");
  params.checked &&
    element.querySelector("input").setAttribute("checked", "true");
  !params.checked && element.querySelector("input").removeAttribute("checked");
  element.querySelector("input").setAttribute("id", `${params.id}`);
  element.querySelector("label").setAttribute("for", `${params.id}`);
  element.querySelector(".itemContent p").textContent = params.content;
  return element;
}

function todoCreatorForData(content) {
  let todoObject = {
    content: content,
    checked: false,
    id: Date.now(),
  };
  return todoObject;
}

function renderTodosAdd() {
  document.querySelector(".todoContent").prepend(document.createElement("hr"));
  document
    .querySelector(".todoContent")
    .prepend(todoCreatorForRender(data[data.length - 1]));
}

function renderLeftItems() {
  let index = 0;
  data.forEach((item) => {
    !item.checked && (index += 1);
  });
  document.querySelector(".bottomBar p").textContent = `${index} items left`;
}
function addOrRemoveThrough(label) {
  label.parentElement.parentElement
    .querySelector(".itemContent p")
    .classList.toggle("lineThrough");
}

function deleteTodo(id) {
  data = data.filter((item) => item.id != id);
}
function renderByMenu(menu) {
  let div = document.querySelector(".todoContent");
  div.innerHTML = "";
  switch (menu) {
    case "All":
      data.forEach((item) => {
        div.prepend(document.createElement("hr"));
        let newItem = todoCreatorForRender(item);
        item.checked &&
          newItem.querySelector(".itemContent p").classList.add("lineThrough");
        div.prepend(newItem);
      });
      break;
    case "Active":
      data.forEach((item) => {
        if (!item.checked) {
          div.prepend(document.createElement("hr"));
          div.prepend(todoCreatorForRender(item));
        }
      });
      break;
    case "Completed":
      data.forEach((item) => {
        if (item.checked) {
          div.prepend(document.createElement("hr"));
          let newItem = todoCreatorForRender(item);
          newItem.querySelector(".itemContent p").classList.add("lineThrough");
          div.prepend(newItem);
        }
      });
      break;
    default:
      break;
  }
}
function setColorDownArrow() {
  console.log(document.querySelector(".downArrow p"));

  if (data.some((item) => item.checked === false) || !data.length) {
    document.querySelector(".downArrow > p").classList.remove("greyDark");
    document.querySelector(".downArrow > p").classList.add("greyWhite");
  } else {
    document.querySelector(".downArrow > p").classList.remove("greyWhite");
    document.querySelector(".downArrow > p").classList.add("greyDark");
  }
}
function downloadData() {
  localStorage.getItem("todo") &&
    (data = JSON.parse(localStorage.getItem("todo")));
}

function uploadData() {
  localStorage.setItem("todo", JSON.stringify(data));
}

///////////////// Add Event Listeners //////////////////////

document.addEventListener("click", (e) => {
  /// Add or Remove Cheked and Rerender
  if (e.target.tagName === "LABEL") {
    let id = e.target.getAttribute("for");
    let indexForAbort = false;
    data.forEach((item) => {
      if (!indexForAbort) {
        if (item.id === Number(id)) {
          item.checked = !item.checked;
          addOrRemoveThrough(e.target);
          indexForAbort = true;
        }
      }
    });
    uploadData();
    renderByMenu(indexForRender);
    renderLeftItems();
    setColorDownArrow();
  }
  /// Delete Todo and Rerender
  if (e.target.classList.contains("deleteButton")) {
    deleteTodo(
      Number(
        e.target.parentElement.parentElement
          .querySelector(".checkbox")
          .querySelector("input").id
      )
    );
    uploadData();
    renderByMenu(indexForRender);
    renderLeftItems();
    setColorDownArrow();
  }
  /// Change Menu and Rerender

  if (e.target.tagName === "A") {
    indexForRender = e.target.textContent;
    renderByMenu(indexForRender);
  }

  /// Add or Remove ALL

  if (e.target.parentElement.classList.contains("downArrow")) {
    if (data.length >= 1) {
      if (data.every((item) => item.checked === true)) {
        data.forEach((item) => {
          item.checked = false;
        });
      } else {
        data.forEach((item) => {
          !item.checked && (item.checked = true);
        });
      }
      uploadData();
      renderByMenu(indexForRender);
      renderLeftItems();
      setColorDownArrow();
    }
  }
});

document.querySelector(".todoName").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.value.length >= 1) {
    data.push(todoCreatorForData(e.target.value));
    uploadData();
    renderTodosAdd();
    renderByMenu(indexForRender);
    renderLeftItems();
    e.target.value = "";
  }
});

/////////////////////// First Render /////////////////////////////

downloadData();
renderByMenu(indexForRender);
setColorDownArrow();
renderLeftItems();
