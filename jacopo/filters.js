document.addEventListener('DOMContentLoaded', function () {
  const header = document.getElementById("people-header");
  const filterBox = document.getElementById("people-filter");
  const rows = document.querySelectorAll("tbody tr");

  // Step 1: Get all unique people
  const peopleSet = new Set();
  rows.forEach(row => {
    const cell = row.children[3];
    if (cell) {
      const people = cell.textContent.split(",").map(p => p.trim());
      people.forEach(person => peopleSet.add(person));
    }
  });

  // Step 2: Create checkboxes
  peopleSet.forEach(person => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = person;
    checkbox.checked = true;

    checkbox.addEventListener("change", filterRows);

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + person));
    filterBox.appendChild(label);
    filterBox.appendChild(document.createElement("br"));
  });

  // Step 3: Toggle dropdown
  header.addEventListener("click", function (e) {
    filterBox.style.display = filterBox.style.display === "none" ? "block" : "none";
    e.stopPropagation();
  });

  // Hide the dropdown if clicking outside
  document.addEventListener("click", function () {
    filterBox.style.display = "none";
  });

  // Step 4: Filter rows
  function filterRows() {
    const checked = Array.from(filterBox.querySelectorAll("input:checked")).map(cb => cb.value);

    rows.forEach(row => {
      const people = row.children[3].textContent.split(",").map(p => p.trim());
      const match = people.some(p => checked.includes(p));
      row.style.display = match ? "" : "none";
    });
  }
});
