const createAccount = document.getElementById("createAccount");
const signupDetails = document.forms.signupform;

createAccount?.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = signupDetails.email.value;
    const password = signupDetails.password.value;
    const confirmPassword = signupDetails.confirmPassword.value;

    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    const info = new FormData(signupDetails);
    const jstring = JSON.stringify(Object.fromEntries(info));
    console.log(jstring)
    try {
        const response = await fetch('/create-account', {
            method: 'POST',
            body: jstring,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(response);

        if (response.status == 201) {
            alert("Account created successfully! Please log in.");
            window.location.href = "/login";
        } else if (response.status == 409) {
            alert("ERROR: An account already exists with this email");
        } else {
            alert("ERROR: Failed to create account, make sure it ends with '@gmail.com'");
            console.log("ERROR: Failed to create account in signup.js");
        }
    } catch (err) {
        console.log(err);
        alert("An error occurred. Please try again.");
    }
});