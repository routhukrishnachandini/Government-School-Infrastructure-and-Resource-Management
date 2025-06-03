document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('complaint-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form from submitting
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;
        
        const school = localStorage.getItem('school')
        const location = localStorage.getItem('location') 
        const Name = localStorage.getItem('userFullName')
        const email = localStorage.getItem('userEmail')

        // Create an object to hold the form data
        const formData = {
            category: category,
            description: description,
            location:location,
            school:school,
            email:email,
            name:Name
        };

        console.log('Complaint submitted:', formData);

        // Example using fetch:
        
        fetch('http://localhost:8000/api/v1/complaint/complaint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            
            window.location.href = '/api/v1/users/feedback_telugu';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    

        // Reset the form fields after submission
        form.reset();
    });
});
