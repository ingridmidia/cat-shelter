const addCat = document.getElementById("add-cat-button").addEventListener(addCat);

async function addCat(event) {
    event.preventDefault();

    const name = document.getElementById("cat-name").value.trim();
    const breed = document.getElementById("cat-breed").value.trim();
    const age = document.getElementById("cat-age").value.trim();
    const description = document.getElementById("cat-description").value.trim();
    const 
    const adoptable = document.getElementById("adoptable");

    if (title && content) {
        const response = await fetch("/api/cat/new", {
            method: "POST",
            body: JSON.stringify({ title, content }),
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            document.location.replace("/dashboard");
        } else {
            alert(response.statusText);
        }
    }
}