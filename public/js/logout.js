document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
    const profileLink = document.getElementById('profileLink');

    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            fetch('/logout', {
                method: 'GET',
                credentials: 'same-origin'
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.message === "Logged out successfully") {
                    window.location.href = '/login';
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    if (profileLink) {
        profileLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/profile';
        });
    }
});