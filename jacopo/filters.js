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

document.addEventListener("DOMContentLoaded", () => {
  const dateHeader = document.getElementById("date-header");
  const dateFilterBox = document.getElementById("date-filter");
  const rows = Array.from(document.querySelectorAll("tbody tr"));

  // Create dropdown options
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
      return new Date(year, 0, 1); // Default to January
    } else {
      return new Date(0); // invalid format fallback
    }
  }

  function sortByDate(ascending) {
    const sorted = [...rows].sort((a, b) => {
      const aDate = parseDate(a.cells[1].textContent);
      const bDate = parseDate(b.cells[1].textContent);
      return ascending ? aDate - bDate : bDate - aDate;
    });

    const tbody = document.querySelector("tbody");
    sorted.forEach(row => tbody.appendChild(row));
  }

  // Dropdown toggle
  document.addEventListener("click", (event) => {
    const isHeaderClick = dateHeader.contains(event.target);
    const isFilterClick = dateFilterBox.contains(event.target);

    if (isHeaderClick) {
      const isVisible = dateFilterBox.style.display === "block";
      dateFilterBox.style.display = isVisible ? "none" : "block";
    } else if (!isFilterClick) {
      dateFilterBox.style.display = "none";
    }
  });
});
