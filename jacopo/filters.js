document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("people-header");
  const filterBox = document.getElementById("people-filter");
  const rows = document.querySelectorAll("tbody tr");

  const peopleSet = new Set();

  rows.forEach(row => {
    const people = row.cells[3].textContent.split(",").map(p => p.trim());
    people.forEach(p => peopleSet.add(p));
  });

  const people = Array.from(peopleSet).sort();
  const checkboxes = {};

  // Create "All" checkbox
  const allCheckbox = document.createElement("input");
  allCheckbox.type = "checkbox";
  allCheckbox.checked = true;
  allCheckbox.id = "checkbox-all";
  allCheckbox.addEventListener("click", (e) => e.stopPropagation()); // Prevent closing

  const allLabel = document.createElement("label");
  allLabel.textContent = "All";
  allLabel.htmlFor = "checkbox-all";

  const wrapperAll = document.createElement("div");
  wrapperAll.appendChild(allCheckbox);
  wrapperAll.appendChild(allLabel);
  filterBox.appendChild(wrapperAll);

  // Create individual checkboxes
  people.forEach(person => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.id = `checkbox-${person}`;
    checkbox.addEventListener("click", (e) => e.stopPropagation()); // Prevent closing
    checkbox.addEventListener("change", updateVisibility);
    checkboxes[person] = checkbox;

    const label = document.createElement("label");
    label.textContent = person;
    label.htmlFor = `checkbox-${person}`;

    const wrapper = document.createElement("div");
    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    filterBox.appendChild(wrapper);
  });

  allCheckbox.addEventListener("change", () => {
    const checked = allCheckbox.checked;
    Object.values(checkboxes).forEach(cb => cb.checked = checked);
    updateVisibility();
  });

  function updateVisibility() {
    const activePeople = Object.entries(checkboxes)
      .filter(([_, checkbox]) => checkbox.checked)
      .map(([name]) => name);

    // Update "All" checkbox state
    const allChecked = Object.values(checkboxes).every(cb => cb.checked);
    allCheckbox.checked = allChecked;

    rows.forEach(row => {
      const rowPeople = row.cells[3].textContent.split(",").map(p => p.trim());
      const visible = rowPeople.some(person => activePeople.includes(person));
      row.style.display = visible ? "" : "none";
    });
  }

  // Toggle dropdown visibility
  document.addEventListener("click", (event) => {
    const isHeaderClick = header.contains(event.target);
    const isFilterClick = filterBox.contains(event.target);

    if (isHeaderClick) {
      filterBox.style.display = filterBox.style.display === "none" ? "block" : "none";
    } else if (!isFilterClick) {
      filterBox.style.display = "none";
    }
  });
});
