document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('typewriterText');
    const fullText = "Hello visitor,\n\nwelcome to an oasis, a place where worries are not a thing and only vibes are...";
    const typingSpeed = 50; // ms per character

    let charIndex = 0;

    function typeWriter() {
        if (charIndex < fullText.length) {
            textElement.textContent += fullText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, typingSpeed);
        }
    }

    // Start typing after a short delay
    setTimeout(typeWriter, 500);
});
