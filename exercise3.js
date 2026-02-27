let userGrid = document.getElementById("userGrid");
let toggle = document.getElementById("viewToggleBtn");
let deleteInput = document.getElementById("deleteIdInput");
let deleteBtn = document.getElementById("deleteBtn");
let sortGroup = document.getElementById("sortByGroupBtn");
let sortID = document.getElementById("sortByIdBtn");
let users = [];


async function render(users){

    userGrid.innerHTML = users.map(user =>`<article class="user-card">
      <h3>${user.first_name ?? "Unknown"}</h3>
      <p>first_name: ${user.first_name ?? ""}</p>
      <p>user_group: ${user.user_group ?? ""}</p>
      <p>id: ${user.id ?? ""}</p>
    </article>`).join('');
}
async function retrieveData(){
    try {
        const response = await fetch('https://69a1e2f52e82ee536fa27ac8.mockapi.io/users_api');

        const data = await response.json();

        users = data;
        console.log("Fetched data: ", users);
        render(users);
        return users;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}
retrieveData();

toggle.addEventListener('click', function(){
    userGrid.classList.toggle("grid-view")
    userGrid.classList.toggle("list-view")
});

sortGroup.addEventListener('click', function(){
    users.sort((a,b) => a.user_group - b.user_group);
    render(users);
});
sortID.addEventListener('click', function(){
    users.sort((a,b) => a.id - b.id);
    render(users);
});

deleteBtn.addEventListener('click', async function() {
    const inpID = deleteIdInput.value;

    if (!inpID) {
        console.error("Please enter a valid ID.");
        return;
    }

    try {

        const response = await fetch(`https://69a1e2f52e82ee536fa27ac8.mockapi.io/users_api/${inpID}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`User with ID ${inpID} not found or API error.`);
        }

        const index = users.findIndex(user => user.id === inpID);
        
        if (index !== -1) {
            users.splice(index, 1);
            render(users);
            console.log(`User ${inpID} successfully deleted.`);
        } else {
            console.warn("User deleted from API but not found in local list.");
        }

    } catch (error) {
        console.error("Deletion failed:", error);
    }
});