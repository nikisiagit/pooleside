document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('typewriterText');
    const scrollIndicator = document.getElementById('scrollIndicator');

    if (!textElement) return;

    // Text parts
    const part1 = "Hello visitor,";
    const part2 = "\n\nwelcome to an oasis, a place where\nworries are not a thing and only\nvibes are...";

    let index1 = 0;
    let index2 = 0;
    const speed = 150;

    function typePart1() {
        if (index1 < part1.length) {
            textElement.textContent += part1.charAt(index1);
            index1++;
            setTimeout(typePart1, speed);
        } else {
            // Part 1 done, wait 2 seconds
            setTimeout(typePart2, 2000);
        }
    }

    function typePart2() {
        if (index2 < part2.length) {
            textElement.textContent += part2.charAt(index2);
            index2++;
            setTimeout(typePart2, speed);
        } else {
            // All done, show scroll indicator
            if (scrollIndicator) {
                scrollIndicator.style.opacity = '1';
            }
        }
    }

    // Wait 3 seconds initially
    setTimeout(typePart1, 3000);
});
