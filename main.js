document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const container = document.getElementById('game-container');
    const toggleButton = document.getElementById('toggle-view');
    
    let currentGame = null;
    let is3D = false;
    
    // Start de 2D-game standaard
    function start2DGame() {
        // Verwijder eventuele bestaande game
        if (currentGame) {
            // Zorg ervoor dat de game correct wordt opgeruimd
            if (currentGame.scene) {
                // 3D game opruimen
                currentGame.renderer.dispose();
                currentGame.scene.traverse((object) => {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });
            }
            // Canvas opnieuw toevoegen voor 2D
            container.innerHTML = `
                <canvas id="game-canvas"></canvas>
                <button id="toggle-view">Schakel naar 3D</button>
            `;
            toggleButton.textContent = 'Schakel naar 3D';
        }
        
        currentGame = new Game2D(document.getElementById('game-canvas'));
        currentGame.start();
        is3D = false;
    }
    
    // Start de 3D-game
    function start3DGame() {
        // Verwijder eventuele bestaande game
        if (currentGame) {
            // 2D game opruimen
            container.innerHTML = `
                <div id="game-3d"></div>
                <button id="toggle-view">Schakel naar 2D</button>
            `;
            toggleButton.textContent = 'Schakel naar 2D';
        } else {
            container.innerHTML = `
                <div id="game-3d"></div>
                <button id="toggle-view">Schakel naar 2D</button>
            `;
        }
        
        currentGame = new Game3D(document.getElementById('game-3d'));
        currentGame.start();
        is3D = true;
    }
    
    // Event listener voor de schakelknop
    function setupToggleButton() {
        toggleButton.addEventListener('click', () => {
            if (is3D) {
                start2DGame();
            } else {
                start3DGame();
            }
        });
    }
    
    // Initialiseer de game
    start2DGame();
    setupToggleButton();
});
