document.addEventListener("DOMContentLoaded", () => {
  const peopleHeader = document.getElementById("people-header");
  const peopleFilterBox = document.getElementById("people-filter");
  const dateHeader = document.getElementById("date-header");
  const dateFilterBox = document.getElementById("date-filter");
  const tbody = document.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  // --- PEOPLE FILTER ---
  const peopleSet = new Set();
  rows.forEach(row => {
    const people = row.cells[3].textContent.split(",").map(p => p.trim());
    people.forEach(p => peopleSet.add(p));
  });

  const people = Array.from(peopleSet).sort();
  const checkboxes = {};

  const allCheckbox = document.createElement("input");
  allCheckbox.type = "checkbox";
  allCheckbox.checked = true;
  allCheckbox.id = "checkbox-all";
  allCheckbox.addEventListener("click", (e) => e.stopPropagation());

  const allLabel = document.createElement("label");
  allLabel.textContent = "All";
  allLabel.htmlFor = "checkbox-all";

  const wrapperAll = document.createElement("div");
  wrapperAll.appendChild(allCheckbox);
  wrapperAll.appendChild(allLabel);
  peopleFilterBox.appendChild(wrapperAll);

  people.forEach(person => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.id = `checkbox-${person}`;
    checkbox.addEventListener("click", (e) => e.stopPropagation());
    checkbox.addEventListener("change", updateVisibility);
    checkboxes[person] = checkbox;

    const label = document.createElement("label");
    label.textContent = person;
    label.htmlFor = `checkbox-${person}`;

    const wrapper = document.createElement("div");
    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    peopleFilterBox.appendChild(wrapper);
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

    const allChecked = Object.values(checkboxes).every(cb => cb.checked);
    allCheckbox.checked = allChecked;

    rows.forEach(row => {
      const rowPeople = row.cells[3].textContent.split(",").map(p => p.trim());
      const visible = rowPeople.some(person => activePeople.includes(person));
      row.style.display = visible ? "" : "none";
    });
  }

  // --- DATE SORTING ---
  const options = [
    { label: "Oldest to Newest", value: "asc" },
    { label: "Newest to Oldest", value: "desc" }
  ];

  options.forEach(opt => {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "date-sort";
    radio.value = opt.value;
    radio.id = `date-${opt.value}`;

    const label = document.createElement("label");
    label.textContent = opt.label;
    label.htmlFor = radio.id;

    const wrapper = document.createElement("div");
    wrapper.appendChild(radio);
    wrapper.appendChild(label);
    dateFilterBox.appendChild(wrapper);

    radio.addEventListener("click", (e) => e.stopPropagation());
    label.addEventListener("click", (e) => e.stopPropagation());

    radio.addEventListener("change", () => {
      sortByDate(opt.value === "asc");
    });
  });

  function parseDate(text) {
    const months = {
      january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
      july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
    };
    const parts = text.trim().split(" ");
    if (parts.length === 2) {
      const month = months[parts[0].toLowerCase()];
      const year = parseInt(parts[1], 10);
      return new Date(year, month, 1);
    } else if (parts.length === 1) {
      const year = parseInt(parts[0], 10);
      return new Date(year, 0, 1); // January fallback
    } else {
      return new Date(0); // Invalid
    }
  }

  function sortByDate(ascending) {
    const sortedRows = [...rows].sort((a, b) => {
      const aDate = parseDate(a.cells[2].textContent);
      const bDate = parseDate(b.cells[2].textContent);
      return ascending ? aDate - bDate : bDate - aDate;
    });

    sortedRows.forEach(row => tbody.appendChild(row)); // Reorder
  }

  // --- SINGLE CLICK LISTENER FOR DROPDOWNS ---
  document.addEventListener("click", (event) => {
    const clickInsidePeople = peopleHeader.contains(event.target) || peopleFilterBox.contains(event.target);
    const clickInsideDate = dateHeader.contains(event.target) || dateFilterBox.contains(event.target);

    if (peopleHeader.contains(event.target)) {
      peopleFilterBox.style.display = peopleFilterBox.style.display === "block" ? "none" : "block";
    } else if (!clickInsidePeople) {
      peopleFilterBox.style.display = "none";
    }

    if (dateHeader.contains(event.target)) {
      dateFilterBox.style.display = dateFilterBox.style.display === "block" ? "none" : "block";
    } else if (!clickInsideDate) {
      dateFilterBox.style.display = "none";
    }
  });
});
