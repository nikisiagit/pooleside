document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('typewriterText');
    const bottomLogo = document.getElementById('bottomLogo');
    const waitlistContent = document.getElementById('waitlistContent');
    const waitlistForm = document.getElementById('waitlistForm');
    const waitlistMessage = document.getElementById('waitlistMessage');

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
            // All text done.
            // 1. Show Logo after 1s
            setTimeout(() => {
                if (bottomLogo) bottomLogo.style.opacity = '1';

                // 2. Show Waitlist Form after Logo has faded in (e.g. +1.5s)
                setTimeout(() => {
                    if (waitlistContent) waitlistContent.style.opacity = '1';
                }, 1500);

            }, 1000);
        }
    }

    // Wait 3 seconds initially
    setTimeout(typePart1, 3000);

    // Waitlist form submission
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('waitlistEmail');
            if (emailInput && emailInput.value) {
                waitlistForm.style.display = 'none';
                waitlistMessage.textContent = "You're on the list. We'll be in touch.";
                waitlistMessage.style.display = 'block';
            }
        });
    }
});
