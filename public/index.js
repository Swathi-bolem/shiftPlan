document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/shiftplan") // Update API URL as needed
        .then(response => response.json())
        .then(data => {
            renderTable(data);
        })
        .catch(error => console.error("Error fetching data:", error));
});

let isEditing = false;

        document.getElementById("editButton").addEventListener("click", function () {
            isEditing = !isEditing;
            this.textContent = isEditing ? "Save" : "Edit";
            fetch("http://localhost:3000/shiftplan")
                .then(response => response.json())
                .then(data => {
                    renderTable(data);
                })
                .catch(error => console.error("Error fetching data:", error));
        });

        function renderTable(data) {
            if (!data || data.length === 0) {
                console.error("No data available");
                return;
            }

            const tableHeader = document.getElementById("tableHeader");
            const tableBody = document.getElementById("tableBody");

            tableHeader.innerHTML = "";
            tableBody.innerHTML = "";

            const columns = Object.keys(data[0]);

            columns.forEach(column => {
                const th = document.createElement("th");
                th.textContent = column;
                tableHeader.appendChild(th);
            });

            data.forEach(row => {
                console.log(row.Name)
                const tr = document.createElement("tr");
                columns.forEach((column, index) => {
                    const td = document.createElement("td");

                    // Apply dropdown only from the 3rd column onwards
                    if (index >= 2 && isEditing) {
                        const select = document.createElement("select");
                        const options = [ "Week off", "Holiday", "Unplanned leave", "Planned leave", "Weekend", "Morning shift", "Afternoon shift", "Regular"];
                        options.forEach(option => {
                            const optionElement = document.createElement("option");
                            optionElement.value = option;
                            optionElement.textContent = option;
                            if (row[column] === option) {
                                optionElement.selected = true;
                            }
                            select.appendChild(optionElement);
                        });

                        select.addEventListener("change", function () {
                            updateCell(row.PersonId, column, this.value);
                        });

                        td.appendChild(select);
                    } else {
                        td.textContent = row[column] || "";
                    }
                    
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });
        }

        function updateCell(id, column, newValue) {
            console.log(`Updating Cell: ID=${id}, Column=${column}, New Value=${newValue}`);
            fetch(`http://localhost:3000/updateCell/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ column: column, value: newValue, id:id })
            })
            .then(response => response.json())
            .then(data => console.log("Update success:", data))
            .catch(error => console.error("Error updating cell:", error));
        }