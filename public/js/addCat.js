async function addCat(event) {
    event.preventDefault();

    const name = document.getElementById("cat-name").value.trim();
    const breed = document.getElementById("cat-breed").value.trim();
    const age = document.getElementById("cat-age").value.trim();
    const description = document.getElementById("cat-description").value.trim();
    const photo = document.getElementById("cat-photo").value;
    const shelter_id = urlData[urlData.length - 1];

    if (name && breed && age && description && photo) {
        const response = await fetch("/api/cat/new", {
            method: "POST",
            body: JSON.stringify({ name, breed,  age,  description, photo, shelter_id }),
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            document.location.replace("/myShelter");
        } else {
            alert(response.statusText);
        }
    }
}

document.getElementById("new-cat-submit").addEventListener("submit", addCat);