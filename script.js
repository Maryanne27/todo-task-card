const checkbox = document.getElementById("complete-task");
const card = document.querySelector('[data-testid="test-todo-card"]');
const status = document.querySelector('[data-testid="test-todo-status"]');
const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
const statusControl = document.querySelector(
  '[data-testid="test-todo-status-control"]'
);

const title = document.querySelector('[data-testid="test-todo-title"]');
const desc = document.querySelector('[data-testid="test-todo-description"]');
const priority = document.querySelector('[data-testid="test-todo-priority"]');
const due = document.querySelector('[data-testid="test-todo-due-date"]');

const modal = document.getElementById("modal");
const editTitleInput = document.getElementById("edit-title");
const editDescInput = document.getElementById("edit-desc");
const editPriorityInput = document.getElementById("edit-priority");
const editDateInput = document.getElementById("edit-date");

const descWrapper = document.querySelector(
  '[data-testid="test-todo-collapsible-section"]'
);
const expandBtn = document.querySelector(
  '[data-testid="test-todo-expand-toggle"]'
);
const timeEl = document.querySelector(
  '[data-testid="test-todo-time-remaining"]'
);
const overdueEl = document.querySelector(
  '[data-testid="test-todo-overdue-indicator"]'
);

let cardData = {
  title: "",
  description: "",
  priority: "",
  dueDate: "",
};

// Update status text
function updateStatus(newStatus) {
  status.textContent = newStatus;

  status.classList.remove("pending", "done", "in-progress");

  if (newStatus === "Done") {
    status.classList.add("done");
    card.classList.add("completed");
    checkbox.checked = true;
  } else if (newStatus === "In Progress") {
    status.classList.add("in-progress");
    card.classList.remove("completed");
    checkbox.checked = false;
  } else {
    status.classList.add("pending");
    card.classList.remove("completed");
    checkbox.checked = false;
  }
  updateTimeRemaining(); 
  statusControl.value = newStatus;
}

// Checkbox
checkbox.addEventListener("change", () => {
  updateStatus(checkbox.checked ? "Done" : "Pending");
});
statusControl.addEventListener("change", (e) => {
  updateStatus(e.target.value);
});

// Buttons
const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteBtn = document.querySelector(
  '[data-testid="test-todo-delete-button"]'
);
const saveBtn = document.querySelector('[data-testid="test-todo-save-button"]');
const cancelBtn = document.querySelector(
  '[data-testid="test-todo-cancel-button"]'
);
const viewMode = document.querySelector(".view-mode");

function openModal() {
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// Edit card
editBtn.addEventListener("click", () => {
  cardData = {
    title: title.textContent,
    description: desc.textContent,
    priority: priority.textContent.trim(),
    dueDate: due.getAttribute("datetime"),
  };

  editTitleInput.value = cardData.title;
  editDescInput.value = cardData.description;
  editPriorityInput.value = cardData.priority;
  editDateInput.value = cardData.dueDate;

  openModal();
});

// Delete Button
deleteBtn.addEventListener("click", () => alert("Delete task"));

// Cancel Edit
cancelBtn.addEventListener("click", () => {
  closeModal();
});

// Time
let dueDate = new Date("2026-04-15T17:00:00");

function updateTimeRemaining() {
  const now = new Date();
  const diff = dueDate - now;

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Stop if task completed
  if (status.textContent === "Done") {
    timeEl.textContent = "Completed";
    overdueEl.classList.add("hidden");
    card.classList.remove("overdue");
    return;
  }

  // OVERDUE
  if (diff <= 0) {
    const abs = Math.abs(diff);
    const hours = Math.floor(abs / hour);
    const minutes = Math.floor((abs % hour) / minute);

    if (hours > 0) {
      timeEl.textContent = `Overdue by ${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      timeEl.textContent = `Overdue by ${minutes} minute${
        minutes > 1 ? "s" : ""
      }`;
    }

    overdueEl.classList.remove("hidden");
    card.classList.add("overdue");
    return;
  }

  //  NORMAL TIME
  overdueEl.classList.add("hidden");
  card.classList.remove("overdue");

  const days = Math.floor(diff / day);
  const hours = Math.floor((diff % day) / hour);
  const minutes = Math.floor((diff % hour) / minute);

  if (days > 0) {
    timeEl.textContent = `Due in ${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    timeEl.textContent = `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    timeEl.textContent = `Due in ${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
}

setInterval(updateTimeRemaining, 60000);
updateTimeRemaining();

expandBtn.addEventListener("click", () => {
  const isExpanded = descWrapper.classList.toggle("expanded");

  expandBtn.textContent = isExpanded ? "Show less" : "Show more";
  expandBtn.setAttribute("aria-expanded", isExpanded);
});

checkDescriptionLength();

function checkDescriptionLength() {
  if (descWrapper.scrollHeight <= descWrapper.clientHeight) {
    expandBtn.style.display = "none";
  } else {
    expandBtn.style.display = "inline-block"; 
  }
}

function updatePriority(newPriority) {
  const dot = priority.querySelector(".priority-dot");
  priority.textContent = newPriority;

  priority.innerHTML = "";
  priority.appendChild(dot);
  priority.append(" " + newPriority);

  priority.classList.remove("low", "medium", "high");
  const lower = newPriority.toLowerCase();
  priority.classList.add(lower);
}

// Save Edit
saveBtn.addEventListener("click", () => {
  title.textContent = editTitleInput.value;
  desc.textContent = editDescInput.value;

  const newPriority = editPriorityInput.value;
  updatePriority(newPriority);

  if (editDateInput.value) {
    const newDate = new Date(editDateInput.value);
    dueDate = newDate;
    due.textContent = newDate.toLocaleString();
    due.setAttribute("datetime", editDateInput.value);
  }

  updateTimeRemaining();
  checkDescriptionLength();
  closeModal();
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});
