class Game {
    constructor() {
        // Basis game instellingen
        this.clock = new THREE.Clock();
        this.loaded = false;
        this.score = { home: 0, away: 0 };
        this.matchTime = 0; // In seconden
        this.isPaused = false;
        
        // Initialiseer de game
        this.initRenderer();
        this.initScene();
        this.initCamera();
        this.initLights();
        this.initControls();
        this.initEventListeners();
        
        // Laad assets
        this.loadAssets().then(() => {
            this.loaded = true;
            this.hideLoadingScreen();
            this.animate();
        });
    }
    
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('game-container').prepend(this.renderer.domElement);
    }
    
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Blauwe lucht
        
        // Voeg een vloer toe als tijdelijke referentie
        const floorGeometry = new THREE.PlaneGeometry(100, 100);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2E8B57, 
            roughness: 0.8,
            metalness: 0.2
        });
        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.floor.rotation.x = -Math.PI / 2;
        this.floor.receiveShadow = true;
        this.scene.add(this.floor);
    }
    
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 10, 20);
        this.camera.lookAt(0, 0, 0);
    }
    
    initLights() {
        // Hoofdlicht (zon)
        const sunLight = new THREE.DirectionalLight(0xffffff, 1);
        sunLight.position.set(100, 100, 50);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);
        
        // Omgevingslicht voor zachte schaduwen
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
    }
    
    initControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
    }
    
    initEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // Toetsenbord besturing
        this.keys = {};
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }
    
    async loadAssets() {
        // Hier komen later de 3D-modellen en texturen
        // Voor nu simuleren we een laadtijd
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update de laadbalk
        const progressBar = document.getElementById('loading-progress');
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    update(delta) {
        if (this.isPaused) return;
        
        // Update controls
        if (this.controls) this.controls.update();
        
        // Update spelers en bal (wordt later toegevoegd)
        
        // Update speeltijd
        this.matchTime += delta;
        this.updateScoreboard();
    }
    
    updateScoreboard() {
        // Update de scorebord UI
        document.getElementById('team-home').textContent = this.score.home;
        document.getElementById('team-away').textContent = this.score.away;
        
        // Formatteer de speeltijd (minuten:seconden)
        const minutes = Math.floor(this.matchTime / 60);
        const seconds = Math.floor(this.matchTime % 60);
        document.getElementById('game-time').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        if (this.loaded) {
            this.update(delta);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Exporteer de Game klasse voor gebruik in andere bestanden
window.Game = Game;
