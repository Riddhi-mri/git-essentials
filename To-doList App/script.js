const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const themeToggle = document.getElementById("theme-toggle");
const filterButtons = document.querySelectorAll(".filter-btn");

// Load saved tasks + theme
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  loadTheme();
});

// Add task
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const li = document.createElement("li");
  li.innerHTML = `
    <span>${taskText}</span>
    <div class="buttons">
      <button class="btn complete">✔</button>
      <button class="btn delete">🗑</button>
    </div>
  `;
  taskList.appendChild(li);
  taskInput.value = "";
  saveTasks();
}

// Complete / Delete Task
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    e.target.closest("li").remove();
  } else if (e.target.classList.contains("complete")) {
    e.target.closest("li").classList.toggle("completed");
  }
  saveTasks();
});

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach((li) => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");
    li.innerHTML = `
      <span>${task.text}</span>
      <div class="buttons">
        <button class="btn complete">✔</button>
        <button class="btn delete">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// 🌙 Toggle Dark Mode
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }
}

// 🔍 Filter Tasks
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    filterTasks(btn.dataset.filter);
  });
});

function filterTasks(filter) {
  document.querySelectorAll("#task-list li").forEach((li) => {
    switch (filter) {
      case "all":
        li.style.display = "flex";
        break;
      case "active":
        li.style.display = li.classList.contains("completed") ? "none" : "flex";
        break;
      case "completed":
        li.style.display = li.classList.contains("completed") ? "flex" : "none";
        break;
    }
  });
}
