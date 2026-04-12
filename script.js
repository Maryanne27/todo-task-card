const checkbox = document.getElementById("complete-task");
const card = document.querySelector('[data-testid="test-todo-card"]');
const status = document.querySelector('[data-testid="test-todo-status"]');

// Checkbox
checkbox.addEventListener("change", () => {
  const isDone = checkbox.checked;

  // Update status text
  status.textContent = isDone ? "Done" : "Pending";

  // Update status class
  status.classList.toggle("done", isDone);
  status.classList.toggle("pending", !isDone);

  // Update card state
  card.classList.toggle("completed", isDone);
});

// Buttons
const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteBtn = document.querySelector(
  '[data-testid="test-todo-delete-button"]'
);

editBtn.addEventListener("click", () => console.log("edit task"));
deleteBtn.addEventListener("click", () => alert("Delete task"));

// Time
const dueDate = new Date("2026-04-15T17:00:00");

function updateTimeRemaining() {
  const el = document.querySelector('[data-testid="test-todo-time-remaining"]');
  const now = new Date();
  const diff = dueDate - now;

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (diff <= 0) {
    const overdueHours = Math.floor(Math.abs(diff) / hour);
    if (overdueHours >= 1) {
      el.textContent = `Overdue by ${overdueHours} hour${
        overdueHours > 1 ? "s" : ""
      }`;
    } else {
      el.textContent = "Due now!";
    }
    return;
  }

  const days = Math.floor(diff / day);
  const hours = Math.floor((diff % day) / hour);

  if (days > 1) {
    el.textContent = `Due in ${days} days`;
  } else if (days === 1) {
    el.textContent = "Due tomorrow";
  } else if (hours > 0) {
    el.textContent = `Due in ${hours} hours`;
  } else {
    el.textContent = "Due now!";
  }
}

setInterval(updateTimeRemaining, 60000);
updateTimeRemaining();
