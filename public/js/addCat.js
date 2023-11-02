const addCat = document.getElementById("add-cat-button").addEventListener(addCat);

async function addCat(event) {
    event.preventDefault();

    const name = document.getElementById("title").value.trim();
    const breed = document.getElementById("content").value.trim();
    const age = document.getElementById("content").value.trim();
    const description = document.getElementById("content").value.trim();
    const adoptable = document.getElementById("content").value.trim();

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