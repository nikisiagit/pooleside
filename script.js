document.addEventListener('DOMContentLoaded', () => {
    const bottomLogo = document.getElementById('bottomLogo');

    // Show Logo slowly
    setTimeout(() => {
        if (bottomLogo) bottomLogo.style.opacity = '1';
    }, 1000);

    // Burger Menu Logic
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
});
