var typed = new Typed(".text", {
    strings: ["Engineering Student", "Web Developer", "Frontend Developer"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
  });
  
  document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission
  
    const form = event.target;
    const formData = new FormData(form);
  
    // Convert form data to JSON
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
  
    try {
      const response = await fetch('http://localhost:3000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        showNotification('Message sent!');
        form.reset(); // Reset the form fields
      } else {
        showNotification('Server error. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Network error. Please check your connection.');
    }
  });
  
  function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
  
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000); // Hide notification after 3 seconds
  }
  