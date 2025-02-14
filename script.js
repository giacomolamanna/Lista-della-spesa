document.addEventListener("DOMContentLoaded", function () {
    const listContainer = document.getElementById("lists-container");
    const addListBtn = document.getElementById("add-list");

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
            listHeader.textContent = list.name;

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
            deleteBtn.textContent = "🗑️";
            deleteBtn.addEventListener("click", () => deleteList(index));

            listHeader.appendChild(deleteBtn);
            listDiv.appendChild(listHeader);

            const itemList = document.createElement("ul");
            list.items.forEach((item, itemIndex) => {
                const itemLi = document.createElement("li");

                const itemContainer = document.createElement("div");
                itemContainer.classList.add("list-item-container");

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

                const itemText = document.createElement("span");
                itemText.textContent = item.name;

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = item.bought;
                checkbox.classList.add("checkbox");
                checkbox.addEventListener("change", () => {
                    lists[index].items[itemIndex].bought = checkbox.checked;
                    saveLists();
                });

                const deleteItemBtn = document.createElement("button");
                deleteItemBtn.classList.add("delete-btn");
                deleteItemBtn.textContent = "❌";
                deleteItemBtn.addEventListener("click", () => deleteItem(index, itemIndex));

                itemContainer.appendChild(quantitySelect);
                itemContainer.appendChild(itemText);
                itemLi.appendChild(itemContainer);
                itemLi.appendChild(checkbox);
                itemLi.appendChild(deleteItemBtn);

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
        const newListName = `Lista ${lists.length + 1}`;
        lists.push({ name: newListName, items: [] });
        saveLists();
        renderLists();
    });

    function deleteList(index) {
        if (confirm("Sei sicuro di voler eliminare questa lista?")) {
            lists.splice(index, 1);
            saveLists();
            renderLists();
        }
    }

    function deleteItem(listIndex, itemIndex) {
        if (confirm("Vuoi eliminare questo elemento?")) {
            lists[listIndex].items.splice(itemIndex, 1);
            saveLists();
            renderLists();
        }
    }

    renderLists();
});
