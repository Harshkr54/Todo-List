let todoList = [];
let currentEditIndex = null;

// Load tasks from localStorage and dark mode preference
window.onload = function () {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
        document.getElementById("toggle").classList.add("night-mode");
        document.getElementById("theme_text").textContent = "Dark Mode";
    } else {
        document.getElementById("theme_text").textContent = "Light Mode";
    }
    loadFromLocalStorage();
    updateProgressBar();
};

// Toggle Dark Mode
// Toggle Dark Mode
document.getElementById("toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    // Update theme text
    const themeText = document.getElementById("theme_text");
    if (document.body.classList.contains("dark-mode")) {
        themeText.textContent = "Dark Mode";
    } else {
        themeText.textContent = "Light Mode";
    }

    // Save dark mode preference to localStorage
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

// Load dark mode preference from localStorage
window.onload = function () {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
        document.getElementById("theme_text").textContent = "Dark Mode";
    } else {
        document.getElementById("theme_text").textContent = "Light Mode";
    }
};
// Add Task
function addTodo() {
    let taskInput = document.getElementById("task");
    let startDateInput = document.getElementById("startDate");
    let targetDateInput = document.getElementById("targetDate");
    let priorityInput = document.getElementById("priority");

    let task = taskInput.value.trim();
    let startDate = startDateInput.value;
    let targetDate = targetDateInput.value;
    let priority = priorityInput.value;

    if (task === "" || startDate === "" || targetDate === "") {
        alert("Please enter all details!");
        return;
    }

    if (new Date(startDate) > new Date(targetDate)) {
        alert("Start date cannot be later than the target date!");
        return;
    }

    if (todoList.some(item => item.task === task)) {
        alert("This task already exists!");
        return;
    }

    let newTask = {
        task: task,
        startDate: startDate,
        targetDate: targetDate,
        priority: priority,
        status: "Pending"
    };

    todoList.push(newTask);
    saveToLocalStorage();
    taskInput.value = "";
    startDateInput.value = "";
    targetDateInput.value = "";
    display();
    updateProgressBar();
}

// Display Tasks
function display() {
    let taskList = document.getElementById("task_list");
    taskList.innerHTML = "";

    todoList.forEach((item, index) => {
        let row = document.createElement("tr");

        // Task Column
        let taskCell = document.createElement("td");
        taskCell.textContent = item.task;

        // Start Date Column
        let startDateCell = document.createElement("td");
        startDateCell.textContent = formatDate(item.startDate);

        // End Date Column
        let targetDateCell = document.createElement("td");
        targetDateCell.textContent = formatDate(item.targetDate);

        // Priority Column
        let priorityCell = document.createElement("td");
        priorityCell.textContent = item.priority;

        // Status Column
        let statusCell = document.createElement("td");
        statusCell.textContent = item.status;

        // Action Column
        let actionCell = document.createElement("td");

        // Complete Button
        let completeBtn = document.createElement("button");
        completeBtn.textContent = item.status === "Pending" ? "Mark Complete" : "Mark Pending";
        completeBtn.classList.add("complete_btn");
        completeBtn.onclick = function () {
            toggleStatus(index);
        };

        // Edit Button
        let editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit_btn");
        editBtn.onclick = function () {
            openEditPopup(index);
        };

        // Remove Button
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Remove";
        deleteBtn.classList.add("delete_btn");
        deleteBtn.onclick = function () {
            removeTask(index);
        };

        actionCell.appendChild(completeBtn);
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);

        // Append Cells to Row
        row.appendChild(taskCell);
        row.appendChild(startDateCell);
        row.appendChild(targetDateCell);
        row.appendChild(priorityCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        // Append Row to Table Body
        taskList.appendChild(row);
    });

    updateProgressBar();
}

// Toggle Task Status
function toggleStatus(index) {
    todoList[index].status = todoList[index].status === "Pending" ? "Completed" : "Pending";
    saveToLocalStorage();
    display();
    updateProgressBar();
}

// Open Edit Popup
function openEditPopup(index) {
    currentEditIndex = index;
    let task = todoList[index];
    document.getElementById("edit-task").value = task.task;
    document.getElementById("edit-startDate").value = task.startDate;
    document.getElementById("edit-targetDate").value = task.targetDate;
    document.getElementById("edit-priority").value = task.priority;
    document.getElementById("edit-popup").style.display = "flex";
}

// Close Edit Popup
function closeEditPopup() {
    document.getElementById("edit-popup").style.display = "none";
}

// Save Edited Task
function saveEditedTask() {
    let task = document.getElementById("edit-task").value.trim();
    let startDate = document.getElementById("edit-startDate").value;
    let targetDate = document.getElementById("edit-targetDate").value;
    let priority = document.getElementById("edit-priority").value;

    if (task === "" || startDate === "" || targetDate === "") {
        alert("Please fill all fields!");
        return;
    }

    if (new Date(startDate) > new Date(targetDate)) {
        alert("Start date cannot be later than the target date!");
        return;
    }

    todoList[currentEditIndex].task = task;
    todoList[currentEditIndex].startDate = startDate;
    todoList[currentEditIndex].targetDate = targetDate;
    todoList[currentEditIndex].priority = priority;

    saveToLocalStorage();
    display();
    closeEditPopup();
    updateProgressBar();
}

// Remove Task
function removeTask(index) {
    todoList.splice(index, 1);
    saveToLocalStorage();
    display();
    updateProgressBar();
}

// Update Progress Bar
function updateProgressBar() {
    let totalTasks = todoList.length;
    let completedTasks = todoList.filter(task => task.status === "Completed").length;
    let progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    document.getElementById("progress-bar").style.width = `${progress}%`;
    document.getElementById("progress-text").textContent = `${Math.round(progress)}%`;
}

// Save to Local Storage
function saveToLocalStorage() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

// Load from Local Storage
function loadFromLocalStorage() {
    let storedTasks = localStorage.getItem("todoList");
    if (storedTasks) {
        todoList = JSON.parse(storedTasks);
        display();
    }
}

// Format Date (YYYY-MM-DD to DD-MM-YYYY)
function formatDate(dateString) {
    let parts = dateString.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

// Filter Tasks
function filterTasks(status) {
    let filteredTasks = [];
    if (status === "all") {
        filteredTasks = todoList;
    } else {
        filteredTasks = todoList.filter(task => task.status.toLowerCase() === status);
    }
    displayFilteredTasks(filteredTasks);
}

// Display Filtered Tasks
function displayFilteredTasks(filteredTasks) {
    let taskList = document.getElementById("task_list");
    taskList.innerHTML = "";

    filteredTasks.forEach((item, index) => {
        let row = document.createElement("tr");

        // Task Column
        let taskCell = document.createElement("td");
        taskCell.textContent = item.task;

        // Start Date Column
        let startDateCell = document.createElement("td");
        startDateCell.textContent = formatDate(item.startDate);

        // End Date Column
        let targetDateCell = document.createElement("td");
        targetDateCell.textContent = formatDate(item.targetDate);

        // Priority Column
        let priorityCell = document.createElement("td");
        priorityCell.textContent = item.priority;

        // Status Column
        let statusCell = document.createElement("td");
        statusCell.textContent = item.status;

        // Action Column
        let actionCell = document.createElement("td");

        // Complete Button
        let completeBtn = document.createElement("button");
        completeBtn.textContent = item.status === "Pending" ? "Mark Complete" : "Mark Pending";
        completeBtn.classList.add("complete_btn");
        completeBtn.onclick = function () {
            toggleStatus(todoList.indexOf(item));
        };

        // Edit Button
        let editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit_btn");
        editBtn.onclick = function () {
            openEditPopup(todoList.indexOf(item));
        };

        // Remove Button
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Remove";
        deleteBtn.classList.add("delete_btn");
        deleteBtn.onclick = function () {
            removeTask(todoList.indexOf(item));
        };

        actionCell.appendChild(completeBtn);
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);

        // Append Cells to Row
        row.appendChild(taskCell);
        row.appendChild(startDateCell);
        row.appendChild(targetDateCell);
        row.appendChild(priorityCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        // Append Row to Table Body
        taskList.appendChild(row);
    });
}

// Search Tasks
function searchTasks() {
    let searchTerm = document.getElementById("search").value.toLowerCase();
    let filteredTasks = todoList.filter(task => task.task.toLowerCase().includes(searchTerm));
    displayFilteredTasks(filteredTasks);
}

// Export Tasks
function exportTasks() {
    const data = JSON.stringify(todoList, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    a.click();
    URL.revokeObjectURL(url);
}

// Import Tasks
function importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        try {
            const importedTasks = JSON.parse(content);
            todoList = importedTasks;
            saveToLocalStorage();
            display();
            updateProgressBar();
        } catch (error) {
            alert("Invalid file format!");
        }
    };
    reader.readAsText(file);
}