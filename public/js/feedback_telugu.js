document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.feedback-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission

        // Capture form data
        const experienceType = document.getElementById('experience-type').value;
        const description = document.getElementById('comments').value; 
        const school = localStorage.getItem('school')
        const location = localStorage.getItem('location') 
        const Name = localStorage.getItem('userFullName')
        const email = localStorage.getItem('userEmail')

        // Create an object to hold the form data
        const formData = {
            category: experienceType,
            description: description,
            location:location,
            school:school,
            email:email,
            name:Name
        };

        console.log('Feedback submitted:', formData);

        // Example using fetch:
        fetch('http://localhost:8000/api/v1/users/feedback', { // Adjust URL as needed
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Feedback submitted successfully!');
            window.location.href = 'http://localhost:8000/api/v1/school/school'; // Redirect after success, adjust URL as needed
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('There was an error submitting your feedback. Please try again.');
        });

        // Reset the form fields after submission
        form.reset();
    });
});
