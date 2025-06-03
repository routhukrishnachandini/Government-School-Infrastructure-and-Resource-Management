document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
  
    form.addEventListener('submit', (event) => {
      event.preventDefault();
  
      // Basic form validation (add more robust validation as needed)
      const username = document.getElementById('username').value;
      const fullname = document.getElementById('fullname').value;
      const email = document.getElementById('email').value;
      const userType = document.getElementById('user-type').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
  
      if (!username || !fullname || !email || !userType || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
      }
  
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
  
      // Create a data object to send to the server
      const formData = {
        username,
        fullname,
        email,
        userType,
        password,
      };
    
      // Send data to the server (replace with your server-side endpoint)
      fetch('http://localhost:8000/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Registration successful:', data);
          form.reset(); // Reset form after successful submissio
          window.location.href = '/api/v1/school/school_telugu'; 
          // Handle successful registration (e.g., redirect, show success message)
        })
        .catch(error => {
          console.error('Registration failed:', error);
          // Handle registration errors (e.g., display error message)
        });
    });
  });
  