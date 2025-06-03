document.addEventListener('DOMContentLoaded', () => {
    const englishButton = document.getElementById('english-button');
    const teluguButton = document.getElementById('telugu-button');

    englishButton.addEventListener('click', () => {
        window.location.href = 'api/v1/users/login'; 
    });

    teluguButton.addEventListener('click', () => {
        window.location.href = 'api/v1/users/login_telugu'; 
    });
});
