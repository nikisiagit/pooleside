document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('typewriterText');

    if (!textElement) return;

    const text = "Hello visitor,\n\nwelcome to an oasis, a place where worries are not a thing and only vibes are...";

    let index = 0;
    const speed = 80; // Slower typing speed (was 40)

    function type() {
        if (index < text.length) {
            textElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    // Wait 1 second after cursor loads before starting to type
    setTimeout(type, 1000);
});
