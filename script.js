document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('typewriterText');

    if (!textElement) return;

    // Text split across 3 lines
    const text = "Hello visitor,\n\nwelcome to an oasis, a place where\nworries are not a thing and only\nvibes are...";

    let index = 0;
    const speed = 120; // Slower typing speed (was 80)

    function type() {
        if (index < text.length) {
            textElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    // Wait 3 seconds after cursor loads before typing starts
    setTimeout(type, 3000);
});
