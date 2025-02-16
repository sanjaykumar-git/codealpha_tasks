document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.querySelector("#task-input");
  const dueDateInput = document.querySelector("#due-date");
  const categorySelect = document.querySelector("#category");
  const addTaskBtn = document.querySelector("#add-task-btn");
  const taskList = document.querySelector("#task-list");
  const filterCategory = document.querySelector("#filter-category");

  // Load tasks from localStorage
  const loadTasks = () => {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.forEach(task => addTaskToDOM(task.text, task.dueDate, task.category, task.completed));
  };

  // Save tasks to localStorage
  const saveTasks = () => {
      const tasks = [];
      document.querySelectorAll("#task-list li").forEach(taskItem => {
          tasks.push({
              text: taskItem.querySelector(".task-text").innerText,
              dueDate: taskItem.querySelector(".task-date").innerText,
              category: taskItem.getAttribute("data-category"),
              completed: taskItem.querySelector(".task-checkbox").checked
          });
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // Function to create a new task
  const addTaskToDOM = (taskText, dueDate, category, completed = false) => {
      if (taskText === "") return;

      const taskItem = document.createElement("li");
      taskItem.className = "flex items-center justify-between bg-gray-800 p-2 rounded shadow-md transition-all duration-200";
      taskItem.setAttribute("data-category", category);

      taskItem.innerHTML = `
          <input type="checkbox" class="task-checkbox" ${completed ? "checked" : ""}>
          <span class="task-text ${completed ? "line-through text-gray-500" : "text-white"}">${taskText} 
              <small class="text-gray-400">(${category})</small>
          </span>
          <span class="task-date text-gray-300">${dueDate ? dueDate : "No Due Date"}</span>
          <button class="delete-btn text-red-500 hover:text-red-700">❌</button>
      `;

      // Mark task as completed
      const checkbox = taskItem.querySelector(".task-checkbox");
      checkbox.addEventListener("change", () => {
          taskItem.querySelector(".task-text").classList.toggle("line-through");
          taskItem.querySelector(".task-text").classList.toggle("text-gray-500");
          saveTasks();
      });

      // Delete task
      taskItem.querySelector(".delete-btn").addEventListener("click", () => {
          taskItem.remove();
          saveTasks();
      });

      taskList.appendChild(taskItem);
      saveTasks();
  };

  // Add new task event
  addTaskBtn.addEventListener("click", () => {
      addTaskToDOM(taskInput.value.trim(), dueDateInput.value, categorySelect.value);
      taskInput.value = "";
  });

  // Filter tasks
  filterCategory.addEventListener("change", () => {
      const selectedCategory = filterCategory.value;
      document.querySelectorAll("#task-list li").forEach(task => {
          if (selectedCategory === "All" || task.getAttribute("data-category") === selectedCategory) {
              task.style.display = "flex";
          } else {
              task.style.display = "none";
          }
      });
  });

  loadTasks(); // Load saved tasks on page load
});
