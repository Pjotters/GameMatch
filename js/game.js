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
        const floorGeometry = new THREE.PlaneGeometry(200, 200);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2E8B57, 
            roughness: 0.8,
            metalness: 0.2
        });
        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.floor.rotation.x = -Math.PI / 2;
        this.floor.receiveShadow = true;
        this.scene.add(this.floor);
        
        // Voeg het stadion toe
        this.stadium = new Stadium(this.scene);
    }
    
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        // Plaats de camera aan de zijkant van het veld
        this.camera.position.set(-70, 40, 0);
        this.camera.lookAt(0, 0, 0);
        
        // Voeg een camera helper toe voor debugging
        if (window.location.hash === '#debug') {
            this.cameraHelper = new THREE.CameraHelper(this.camera);
            this.scene.add(this.cameraHelper);
        }
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
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.handleInput();
            
            // Voorkom standaard gedrag voor pijltjestoetsen
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Voeg muisklik toe om te schieten
        window.addEventListener('click', (e) => this.handleMouseClick(e));
    }
    
    handleInput() {
        if (!this.controlledPlayer) return;
        
        const moveSpeed = 0.1;
        const turnSpeed = 0.05;
        
        // Beweeg vooruit/achteruit
        if (this.keys['ArrowUp']) {
            this.controlledPlayer.velocity.x = -Math.sin(this.controlledPlayer.mesh.rotation.z) * moveSpeed;
            this.controlledPlayer.velocity.z = -Math.cos(this.controlledPlayer.mesh.rotation.z) * moveSpeed;
        } else if (this.keys['ArrowDown']) {
            this.controlledPlayer.velocity.x = Math.sin(this.controlledPlayer.mesh.rotation.z) * moveSpeed;
            this.controlledPlayer.velocity.z = Math.cos(this.controlledPlayer.mesh.rotation.z) * moveSpeed;
        } else {
            this.controlledPlayer.velocity.x = 0;
            this.controlledPlayer.velocity.z = 0;
        }
        
        // Draai links/rechts
        if (this.keys['ArrowLeft']) {
            this.controlledPlayer.mesh.rotation.z += turnSpeed;
        } else if (this.keys['ArrowRight']) {
            this.controlledPlayer.mesh.rotation.z -= turnSpeed;
        }
        
        // Springen
        if (this.keys['Space'] && this.controlledPlayer.isGrounded) {
            this.controlledPlayer.velocity.y = 0.15;
            this.controlledPlayer.isGrounded = false;
        }
    }
    
    handleMouseClick(event) {
        if (!this.controlledPlayer || !this.ball) return;
        
        // Controleer of de speler dicht bij de bal is
        const dx = this.controlledPlayer.mesh.position.x - this.ball.mesh.position.x;
        const dz = this.controlledPlayer.mesh.position.z - this.ball.mesh.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < 2) {
            // Bereken de richting waarin de speler kijkt
            const angle = this.controlledPlayer.mesh.rotation.z;
            
            // Geef de bal een zet in de kijkrichting
            this.ball.kick(10, angle);
        }
    }
    
    async loadAssets() {
        const progressBar = document.getElementById('loading-progress');
        let progress = 0;
        
        // Simuleer het laden van assets
        const updateProgress = (step) => {
            progress = Math.min(progress + step, 100);
            progressBar.style.width = `${progress}%`;
            return new Promise(resolve => setTimeout(resolve, 100));
        };
        
        // Laad het stadion
        await updateProgress(30);
        
        // Laad spelers (placeholder voor nu)
        await updateProgress(30);
        
        // Laad de bal (placeholder voor nu)
        await updateProgress(20);
        
        // Laad texturen en modellen
        await updateProgress(20);
        
        return new Promise(resolve => {
            // Wacht nog even zodat de laadbalk 100% bereikt
            setTimeout(() => {
                progressBar.style.width = '100%';
                resolve();
            }, 300);
        });
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
    
    async loadAssets() {
        const progressBar = document.getElementById('loading-progress');
        let progress = 0;
        
        // Simuleer het laden van assets
        const updateProgress = (step) => {
            progress = Math.min(progress + step, 100);
            progressBar.style.width = `${progress}%`;
            return new Promise(resolve => setTimeout(resolve, 100));
        };
        
        // Laad het stadion
        await updateProgress(20);
        
        // Initialiseer de bal
        this.ball = new Ball(this.scene);
        await updateProgress(20);
        
        // Maak de teams
        this.players = [];
        this.createTeam('home', -20); // Thuisteam aan de linkerkant
        this.createTeam('away', 20);  // Uitteam aan de rechterkant
        await updateProgress(30);
        
        // Maak een speler bestuurbaar
        if (this.players.length > 0) {
            this.controlledPlayer = this.players[0];
            this.controlledPlayer.isPlayerControlled = true;
        }
        
        // Laad texturen en modellen
        await updateProgress(20);
        
        // Stel de camera in om de bestuurde speler te volgen
        if (this.controlledPlayer) {
            this.setupCameraFollow();
        }
        
        return new Promise(resolve => {
            // Wacht nog even zodat de laadbalk 100% bereikt
            setTimeout(() => {
                progressBar.style.width = '100%';
                resolve();
            }, 300);
        });
    }
    
    createTeam(team, startX) {
        const positions = [
            { x: startX, z: 0 },    // Midden
            { x: startX, z: -10 },  // Voor
            { x: startX, z: 10 },   // Achter
            { x: startX - 5, z: -5 }, // Links voor
            { x: startX - 5, z: 5 },  // Links achter
            { x: startX + 5, z: -5 }, // Rechts voor
            { x: startX + 5, z: 5 },  // Rechts achter
        ];
        
        for (let i = 0; i < positions.length; i++) {
            const player = new Player(this.scene, team, positions[i]);
            this.players.push(player);
        }
    }
    
    setupCameraFollow() {
        // Maak een leeg object om de camera aan vast te maken
        this.cameraTarget = new THREE.Object3D();
        this.scene.add(this.cameraTarget);
        
        // Plaats de camera achter en boven de speler
        this.cameraOffset = new THREE.Vector3(0, 10, 15);
        
        // Koppel de camera aan het doelwit
        this.camera.lookAt(this.cameraTarget.position);
    }
    
    update(delta) {
        if (this.isPaused) return;
        
        // Update controls
        if (this.controls) this.controls.update();
        
        // Update de bal
        if (this.ball) {
            this.ball.update(delta);
        }
        
        // Update spelers
        this.players.forEach(player => {
            // Laat de AI de bal volgen als de speler niet door de speler wordt bestuurd
            if (!player.isPlayerControlled) {
                player.updateAI(this.ball);
            }
            player.update(delta);
        });
        
        // Volg de bestuurde speler met de camera
        this.updateCameraFollow();
        
        // Update speeltijd
        this.matchTime += delta;
        this.updateScoreboard();
    }
    
    updateCameraFollow() {
        if (!this.controlledPlayer || !this.cameraTarget) return;
        
        const player = this.controlledPlayer.mesh;
        
        // Update de positie van het cameradoel
        this.cameraTarget.position.lerp(player.position, 0.1);
        
        // Bereken de gewenste camerapositie
        const desiredPosition = new THREE.Vector3();
        desiredPosition.copy(player.position);
        
        // Pas de offset toe op basis van de kijkrichting van de speler
        const offset = this.cameraOffset.clone();
        offset.applyQuaternion(player.quaternion);
        desiredPosition.add(offset);
        
        // Beweeg de camera soepel naar de gewenste positie
        this.camera.position.lerp(desiredPosition, 0.1);
        
        // Laat de camera naar het doelwit kijken
        this.camera.lookAt(this.cameraTarget.position);
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
