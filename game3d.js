class Game3D {
    constructor(container) {
        this.container = container;
        this.width = 800;
        this.height = 500;
        
        // Drie.js scene instellen
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        // Spelers en bal
        this.player1 = { mesh: null, score: 0 };
        this.player2 = { mesh: null, score: 0 };
        this.ball = { mesh: null, velocity: new THREE.Vector3(0.08, 0, 0.08) };
        
        // Besturing
        this.keys = {};
        this.playerSpeed = 0.15;
        
        // Initialisatie
        this.init();
    }
    
    init() {
        // Renderer instellen
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x4CAF50);
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);
        
        // Camera positie
        this.camera.position.set(0, 10, 20);
        this.camera.lookAt(0, 0, 0);
        
        // Licht toevoegen
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0x404040));
        
        // Speelveld maken
        this.createField();
        
        // Spelers maken
        this.createPlayers();
        
        // Bal maken
        this.createBall();
        
        // Event listeners
        this.setupEventListeners();
        
        // Start de game loop
        this.animate();
    }
    
    createField() {
        // Groen speelveld
        const fieldGeometry = new THREE.PlaneGeometry(30, 20);
        const fieldMaterial = new THREE.MeshLambertMaterial({ color: 0x2E7D32, side: THREE.DoubleSide });
        const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
        field.rotation.x = -Math.PI / 2;
        this.scene.add(field);
        
        // Witte lijnen
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const lineGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(28, 0.1, 18));
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        lines.position.y = 0.01; // Net boven het veld
        this.scene.add(lines);
        
        // Middenlijn
        const midLineGeometry = new THREE.BoxGeometry(0.5, 0.1, 18);
        const midLine = new THREE.Mesh(midLineGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
        midLine.position.y = 0.02;
        this.scene.add(midLine);
    }
    
    createPlayers() {
        const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
        const player1Material = new THREE.MeshPhongMaterial({ color: 0x3498db });
        const player2Material = new THREE.MeshPhongMaterial({ color: 0xe74c3c });
        
        // Speler 1 (blauw)
        this.player1.mesh = new THREE.Mesh(playerGeometry, player1Material);
        this.player1.mesh.position.set(-10, 1, 0);
        this.scene.add(this.player1.mesh);
        
        // Speler 2 (rood)
        this.player2.mesh = new THREE.Mesh(playerGeometry, player2Material);
        this.player2.mesh.position.set(10, 1, 0);
        this.scene.add(this.player2.mesh);
    }
    
    createBall() {
        const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const ballMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        this.ball.mesh = new THREE.Mesh(ballGeometry, ballMaterial);
        this.ball.mesh.position.set(0, 0.5, 0);
        this.scene.add(this.ball.mesh);
    }
    
    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
    }
    
    update() {
        // Speler 1 besturing (WASD)
        if (this.keys['w']) this.player1.mesh.position.z -= this.playerSpeed;
        if (this.keys['s']) this.player1.mesh.position.z += this.playerSpeed;
        if (this.keys['a']) this.player1.mesh.position.x -= this.playerSpeed;
        if (this.keys['d']) this.player1.mesh.position.x += this.playerSpeed;
        
        // Speler 2 besturing (pijltjes)
        if (this.keys['ArrowUp']) this.player2.mesh.position.z -= this.playerSpeed;
        if (this.keys['ArrowDown']) this.player2.mesh.position.z += this.playerSpeed;
        if (this.keys['ArrowLeft']) this.player2.mesh.position.x -= this.playerSpeed;
        if (this.keys['ArrowRight']) this.player2.mesh.position.x += this.playerSpeed;
        
        // Bal beweging
        this.ball.mesh.position.x += this.ball.velocity.x;
        this.ball.mesh.position.z += this.ball.velocity.z;
        
        // Botsing met randen
        if (Math.abs(this.ball.mesh.position.x) > 14) {
            this.ball.velocity.x *= -1;
        }
        if (Math.abs(this.ball.mesh.position.z) > 9) {
            this.ball.velocity.z *= -1;
        }
        
        // Botsing met spelers
        this.checkCollision(this.player1);
        this.checkCollision(this.player2);
    }
    
    checkCollision(player) {
        const dx = player.mesh.position.x - this.ball.mesh.position.x;
        const dz = player.mesh.position.z - this.ball.mesh.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < 1.5) { // Aangepaste botsingsafstand
            // Bepaal botsingshoek
            const angle = Math.atan2(dz, dx);
            const speed = Math.sqrt(this.ball.velocity.x ** 2 + this.ball.velocity.z ** 2) * 1.1;
            
            // Keer de bal af
            this.ball.velocity.x = Math.cos(angle) * speed;
            this.ball.velocity.z = Math.sin(angle) * speed;
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    start() {
        // Al gestart in init()
    }
}
