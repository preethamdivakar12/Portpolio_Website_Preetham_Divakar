var typed = new Typed(".text", {
    strings: ["Engineering Student", "Web Developer", "Frontend Developer"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});

document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const submitButton = form.querySelector('.send');
    submitButton.value = 'Sending...';
    submitButton.disabled = true;

    try {
        // Use the regular /contact endpoint from server.js
        const response = await fetch('/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('Message sent successfully! ✅');
            form.reset();
        } else {
            showNotification(result.error || 'Error sending message. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Network error. Please check your connection.');
    } finally {
        submitButton.value = 'submit';
        submitButton.disabled = false;
    }
});

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}