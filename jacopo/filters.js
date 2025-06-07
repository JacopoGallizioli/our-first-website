<script>
  const peopleHeader = document.getElementById("people-header");
  const dropdown = document.getElementById("people-dropdown");
  const tableRect = peopleHeader.getBoundingClientRect();

  // Move the dropdown below the header
  peopleHeader.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    const rect = peopleHeader.getBoundingClientRect();
    dropdown.style.top = rect.bottom + window.scrollY + "px";
    dropdown.style.left = rect.left + "px";
  });

  // Collect unique names
  const rows = document.querySelectorAll("tbody tr");
  const peopleSet = new Set();
  rows.forEach(row => {
    row.dataset.people = row.children[3].innerText;
    row.children[3].innerText.split(",").map(n => n.trim()).forEach(name => peopleSet.add(name));
  });

  // Create checkboxes
  peopleSet.forEach(name => {
    const label = document.createElement("label");
    label.style.display = "block";
    label.innerHTML = `<input type="checkbox" value="${name}" checked> ${name}`;
    dropdown.appendChild(label);
  });

  // Filter function
  dropdown.addEventListener("change", () => {
    const selected = new Set([...dropdown.querySelectorAll("input:checked")].map(cb => cb.value));
    rows.forEach(row => {
      const names = row.dataset.people.split(",").map(n => n.trim());
      const match = names.some(name => selected.has(name));
      row.style.display = match ? "" : "none";
    });
  });

  // Optional: close dropdown if clicked outside
  document.addEventListener("click", (e) => {
    if (!peopleHeader.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
</script>
