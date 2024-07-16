const loginAccount = document.getElementById("loginAccount");
const loginDetails = document.forms.loginform;

loginAccount?.addEventListener("click", async (e) => {
    e.preventDefault();
    
    const info = new FormData(loginDetails);
    const jstring = JSON.stringify(Object.fromEntries(info));
    console.log(jstring)
    try {
        const response = await fetch('/login-verify', {
            method: 'POST',
            body: jstring,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(response);

        if(response.status === 200){
            console.log("SUCCESS: Login Successful!");
            window.location.href = '/';
        } else{
            const errorMessage = await response.text();
            alert(errorMessage);
            console.log("ERROR: Failed to login account in login.js");
            loginDetails.reset();// Clear form
        }
    } catch(err){
        console.log(err);
        alert("An error occurred. Please try again.");
        loginDetails.reset();
    }
});