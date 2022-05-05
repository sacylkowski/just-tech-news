// the file used to create new posts

async function newFormHandler(event) {
    event.preventDefault();

    // on form submission, it will grab the post-title and post-url values from the form and send them with a POST request
    const title = document.querySelector("input[name='post-title']").value;
    const post_url = document.querySelector("input[name='post-url']").value;

    // the /api/posts endpoint requires a third property; the user ID
    const response = await fetch(`/api/posts`, {
        method: "POST",
        body: JSON.stringify({
            title,
            post_url
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        document.location.replace("/dashboard");
    } else {
        alert(response.statusText);
    }
}

document.querySelector(".new-post-form").addEventListener("submit", newFormHandler);