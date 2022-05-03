async function signupFormHandler(event) {
    event.preventDefault();

    // making a fetch() POST request to the /api/users/ by updating the signupFormHandler()
    const username = document.querySelector("#username-signup").value.trim();
    const email = document.querySelector("#email-signup").value.trim();
    const password = document.querySelector("#password-signup").value.trim();

    // if all fields have values 
    if (username && email && password) {
        const response = await fetch("/api/users", {
            method: "post",
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: { "Content-Type": "application/json" }
        });
        // check the response status
        if (response.ok) {
            console.log("success");
        } else {
            alert(response.statusText);
        }
    }
}

async function loginFormHandler(event) {
    event.preventDefault();

    // making a fetch() POST request to the /api/users/login by updating the signupFormHandler()
    const email = document.querySelector("#email-login").value.trim();
    const password = document.querySelector("#password-login").value.trim();

    // if all fields have values 
    if (email && password) {
        const response = await fetch("/api/users/login", {
            method: "post",
            body: JSON.stringify({
                email,
                password
            }),
            headers: { "Content-Type": "application/json" }
        });
        // check the response status
        if (response.ok) {
            document.location.replace("/");
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector(".login-form").addEventListener("submit", loginFormHandler);

document.querySelector(".signup-form").addEventListener("submit", signupFormHandler);