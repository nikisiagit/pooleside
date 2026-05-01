document.addEventListener('DOMContentLoaded', () => {
    const heroText = document.getElementById('heroText');
    const bottomLogo = document.getElementById('bottomLogo');

    // Fade in text slowly
    setTimeout(() => {
        if (heroText) heroText.style.opacity = '1';
    }, 500);

    // Show Logo after text has faded in (e.g. +3s)
    setTimeout(() => {
        if (bottomLogo) bottomLogo.style.opacity = '1';
    }, 3500);

});
