document.addEventListener('DOMContentLoaded', () => {
    fetchComplaints();
});

const fetchComplaints = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/v1/complaint/allComplaints'); // API endpoint
        if (!response.ok) throw new Error('Network response was not ok');
        console.log(response);
        
        // Assuming the API response is an array of complaints
        const data = await response.json();
        
        // Ensure the data is an array before calling displayComplaints
        if (Array.isArray(data)) {
            displayComplaints(data);
        } else {
            console.error('Invalid data format:', data);
        }
    } catch (error) {
        console.error('Error fetching complaints:', error);
    }
};

const displayComplaints = (complaints) => {
    const complaintsList = document.getElementById('complaints-list');
    complaintsList.innerHTML = ''; // Clear any existing content

    complaints.forEach(complaint => {
        // Create a new div element for each complaint
        const complaintDiv = document.createElement('div');
        complaintDiv.classList.add('complaint');
        
        // Populate the div with complaint details
        complaintDiv.innerHTML = `
            <p><strong>ID:</strong> ${complaint._id}</p>
            <p><strong>Title:</strong> ${complaint.title}</p>
            <p><strong>Description:</strong> ${complaint.description}</p>
        `;
        
        // Append the new div to the complaints list
        complaintsList.appendChild(complaintDiv);
    });
};
