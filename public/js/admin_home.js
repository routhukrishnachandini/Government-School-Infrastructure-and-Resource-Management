document.addEventListener('DOMContentLoaded', () => {
    const complaintButton = document.getElementById('complaint-button');
    const feedbackButton = document.getElementById('feedback-button');

    complaintButton.addEventListener('click', () => {
        window.location.href = complaintButton.getAttribute('data-href');
    });

    feedbackButton.addEventListener('click', () => {
        window.location.href = feedbackButton.getAttribute('data-href');
    });
});
