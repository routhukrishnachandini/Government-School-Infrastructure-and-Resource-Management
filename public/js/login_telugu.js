document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.login-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loginType = document.querySelector('input[name="login-type"]:checked').value;

        // Create the data object to be sent in the request body
        const formData = {
            username: username,
            password: password,
            loginType: loginType
        };

        console.log('Form Data:', formData); // Log formData for debugging purposes

        // Send the data to the server
        fetch('http://localhost:8000/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            console.log('Response Status:', response.status); // Log the response status
            console.log('Response Headers:', response.headers); // Log the response headers

            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error('Error Data:', errorData); // Log the error data for debugging
                    throw new Error(errorData.message || 'Failed to login');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data); // Log the successful response

            // Store necessary data in localStorage if needed
            const { user } = data.data;

            localStorage.setItem('userFullName', user.fullname);
            localStorage.setItem('userEmail', user.email);

            // Redirect to the dashboard or another page
            if(loginType=="normal"){
                window.location.href = 'http://localhost:8000/api/v1/school/school_telugu';
            } else {
                window.location.href = 'http://localhost:8000/api/v1/users/admin';
            }
        })
        .catch(error => {
            console.error('Error:', error); // Log any errors encountered
            alert(`There was an error during login: ${error.message}`);
        });
    });
});
