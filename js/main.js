document.addEventListener('DOMContentLoaded', () => {
    // Initialiseer de game wanneer de pagina is geladen
    window.game = new Game();
    
    // Voeg event listeners toe voor het menu
    const menuButton = document.getElementById('menu-button');
    menuButton.addEventListener('click', () => {
        // Hier komt de menu-logica
        console.log('Menu geopend');
    });
    
    // Voeg event listeners toe voor toetsenbordbesturing
    document.addEventListener('keydown', (e) => {
        // Pause/Unpause met de spatiebalk
        if (e.code === 'Space') {
            game.isPaused = !game.isPaused;
            console.log('Game ' + (game.isPaused ? 'gepauzeerd' : 'hervat'));
        }
    });
});

// Handmatige laadbalk voor development
window.addEventListener('load', () => {
    const progressBar = document.getElementById('loading-progress');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 100);
});
