document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('typewriterText');

    if (!textElement) return;

    // Use textContent compatible newline characters
    const text = "Hello visitor,\n\nwelcome to an oasis, a place where worries are not a thing and only vibes are...";

    let index = 0;
    const speed = 40; // slightly faster

    function type() {
        if (index < text.length) {
            textElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    // Start with a slight delay to ensure layout is ready
    setTimeout(type, 500);
});
