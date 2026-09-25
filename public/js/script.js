const contactForm = document.getElementById('contactForm');

document.getElementById('contactSend').addEventListener('click', (e) => {
    e.preventDefault();
    contactForm.requestSubmit();
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: document.getElementById('email').value,
                content: document.getElementById('content').value,
            }),
        });
        if (!response.ok) throw new Error();
        alert('Message envoyé !');
        contactForm.reset();
    } catch (error) {
        alert("Erreur lors de l'envoi du message.");
    }
});
