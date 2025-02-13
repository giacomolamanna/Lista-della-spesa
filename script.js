document.addEventListener("DOMContentLoaded", function () {
    const listContainer = document.getElementById("lists-container");
    const addListBtn = document.getElementById("add-list");
    const listNameInput = document.getElementById("list-name");

    let lists = JSON.parse(localStorage.getItem("shoppingLists")) || [];

    function saveLists() {
        localStorage.setItem("shoppingLists", JSON.stringify(lists));
    }

    function renderLists() {
        listContainer.innerHTML = "";
        lists.forEach((list, index) => {
            const listDiv = document.createElement("div");
            listDiv.classList.add("list");

            const listHeader = document.createElement("h2");
            listHeader.innerHTML = `
                ${list.name} 
                <button class="delete-btn" onclick="deleteList(${index})">🗑️</button>
            `;
            listDiv.appendChild(listHeader);

            const itemList = document.createElement("ul");
            list.items.forEach((item, itemIndex) => {
                const itemLi = document.createElement("li");

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = item.bought;
                checkbox.classList.add("checkbox");
                checkbox.addEventListener("change", () => {
                    lists[index].items[itemIndex].bought = checkbox.checked;
                    saveLists();
                });

                const itemText = document.createElement("span");
                itemText.textContent = item.name;

                const quantitySelect = document.createElement("select");
                for (let i = 1; i <= 10; i++) {
                    const option = document.createElement("option");
                    option.value = i;
                    option.textContent = i;
                    if (i === item.quantity) option.selected = true;
                    quantitySelect.appendChild(option);
                }
                quantitySelect.addEventListener("change", () => {
                    lists[index].items[itemIndex].quantity = parseInt(quantitySelect.value);
                    saveLists();
                });

                itemLi.appendChild(checkbox);
                itemLi.appendChild(itemText);
                itemLi.appendChild(quantitySelect);
                itemList.appendChild(itemLi);
            });

            const itemInput = document.createElement("input");
            itemInput.type = "text";
            itemInput.placeholder = "Aggiungi elemento";
            const addItemBtn = document.createElement("button");
            addItemBtn.textContent = "➕";
            addItemBtn.addEventListener("click", () => {
                if (itemInput.value.trim()) {
                    lists[index].items.push({ name: itemInput.value, bought: false, quantity: 1 });
                    itemInput.value = "";
                    saveLists();
                    renderLists();
                }
            });

            listDiv.appendChild(itemList);
            listDiv.appendChild(itemInput);
            listDiv.appendChild(addItemBtn);
            listContainer.appendChild(listDiv);
        });
    }

    addListBtn.addEventListener("click", () => {
        if (listNameInput.value.trim()) {
            lists.push({ name: listNameInput.value, items: [] });
            listNameInput.value = "";
            saveLists();
            renderLists();
        }
    });

window.deleteList = function (index) {
    const confirmDelete = confirm("Sei sicuro di voler eliminare questa lista?");
    if (confirmDelete) {
        lists.splice(index, 1);
        saveLists();
        renderLists();
    }
};
