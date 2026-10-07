const API_URL = "https://jsonplaceholder.typicode.com/users";

const loadUsersButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

let users = [];

function renderUsers(list) {
    usersList.textContent = "";

    if (list.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No users match your filter.";
        usersList.appendChild(emptyMessage);
        return;
    }

    list.forEach(function (user) {
        const listItem = document.createElement("li");

        const name = document.createElement("h2");
        name.textContent = user.name;

        const email = document.createElement("p");
        email.textContent = `Email: ${user.email}`;

        const city = document.createElement("p");
        city.textContent = `City: ${user.address.city}`;

        const company = document.createElement("p");
        company.textContent = `Company: ${user.company.name}`;

        listItem.appendChild(name);
        listItem.appendChild(email);
        listItem.appendChild(city);
        listItem.appendChild(company);

        usersList.appendChild(listItem);
    });
}

async function loadUsers() {
    statusText.textContent = "Loading users...";
    loadUsersButton.disabled = true;

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        users = await response.json();

        renderUsers(users);

        statusText.textContent = `Loaded ${users.length} users.`;
    } catch (error) {
        statusText.textContent = "Could not load users. Please try again.";
        console.error(error);
    } finally {
        loadUsersButton.disabled = false;
    }
}

loadUsersButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", function () {
    const searchTerm = filterInput.value.trim().toLowerCase();

    const filteredUsers = users.filter(function (user) {
        return user.name.toLowerCase().includes(searchTerm);
    });

    renderUsers(filteredUsers);
});