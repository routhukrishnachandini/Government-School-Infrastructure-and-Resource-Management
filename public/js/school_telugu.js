document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.school-selection-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission

        // Collect values from the form
        const school = document.getElementById('school-select').value;
        const location = document.getElementById('school-location').value;

        // Validate the collected data
        if (!school || !location) {
            alert('Please fill out all fields.');
            return; // Important: Stop further execution here
        }

        localStorage.setItem('school',school)
        localStorage.setItem('location',location)


        // Show a loading state or spinner (optional)
        const submitButton = document.getElementById('submit-button');
        submitButton.value = 'Submitting...';
        submitButton.disabled = true;

        // Send data to the server using fetch
        fetch('http://localhost:8000/api/v1/school/school', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                schoolName: school,
                location: location
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || 'Network response was not ok');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            // Reset the form and provide feedback
            form.reset();
            submitButton.value = 'Submit';
            submitButton.disabled = false;
            // Redirect to another page
            window.location.href = '/api/v1/complaint/complaint_telugu'; 
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error processing your request: ' + error.message);
            // Reset the submit button
            submitButton.value = 'Submit';
            submitButton.disabled = false;
        });
    });
});
