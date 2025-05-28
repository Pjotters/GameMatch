class Player {
    constructor(scene, team, position = { x: 0, z: 0 }) {
        this.scene = scene;
        this.team = team; // 'home' of 'away'
        this.position = { ...position, y: 0 };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.targetPosition = { ...position };
        this.speed = 0.2;
        this.isPlayerControlled = false;
        this.isGrounded = true;
        this.jumpForce = 0.2;
        this.gravity = 0.01;
        this.moveSpeed = 0.1;
        
        // Kleuren voor de teams
        this.teamColors = {
            home: 0x3498db, // Blauw
            away: 0xe74c3c  // Rood
        };
        
        this.init();
    }
    
    init() {
        // Maak een eenvoudige speler (voor nu een cilinder)
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1.8, 8);
        const material = new THREE.MeshPhongMaterial({ 
            color: this.teamColors[this.team],
            shininess: 30
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        // Draai de cilinder zodat deze rechtop staat
        this.mesh.rotation.x = Math.PI / 2;
        
        // Voeg een hoofd toe (eenvoudige bol)
        const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const headMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFD3B6, // Huidkleur
            shininess: 10
        });
        
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.position.y = 0.9;
        this.head.castShadow = true;
        this.mesh.add(this.head);
        
        // Stel de initiële positie in
        this.mesh.position.set(this.position.x, 0.9, this.position.z);
        
        // Voeg de speler toe aan de scene
        this.scene.add(this.mesh);
        
        // Voeg een marker toe boven het hoofd van de speler
        this.addTeamMarker();
    }
    
    addTeamMarker() {
        // Voeg een kleine marker toe boven het hoofd van de speler
        const markerGeometry = new THREE.ConeGeometry(0.3, 0.8, 3);
        const markerMaterial = new THREE.MeshBasicMaterial({ 
            color: this.teamColors[this.team],
            transparent: true,
            opacity: 0.8
        });
        
        this.marker = new THREE.Mesh(markerGeometry, markerMaterial);
        this.marker.rotation.x = Math.PI; // Draai de kegel naar beneden
        this.marker.position.y = 1.8; // Boven het hoofd
        this.mesh.add(this.marker);
    }
    
    update(delta) {
        // Pas zwaartekracht toe
        if (!this.isGrounded) {
            this.velocity.y -= this.gravity * delta * 60;
        }
        
        // Update positie op basis van snelheid
        this.position.x += this.velocity.x * delta * 60;
        this.position.z += this.velocity.z * delta * 60;
        this.position.y += this.velocity.y * delta * 60;
        
        // Controleer of de speler op de grond staat
        if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocity.y = 0;
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
        }
        
        // Als de speler niet wordt bestuurd, volg dan de doelpositie
        if (!this.isPlayerControlled) {
            const dx = this.targetPosition.x - this.position.x;
            const dz = this.targetPosition.z - this.position.z;
            const distance = Math.sqrt(dx * dx + dz * dz);
            
            if (distance > 0.5) {
                // Normaliseer de richting en schaal met snelheid
                const vx = (dx / distance) * this.speed * delta * 60;
                const vz = (dz / distance) * this.speed * delta * 60;
                
                // Update snelheid
                this.velocity.x = vx;
                this.velocity.z = vz;
                
                // Draai de speler in de bewegingsrichting
                if (Math.abs(vx) > 0.01 || Math.abs(vz) > 0.01) {
                    this.mesh.rotation.z = Math.atan2(-vx, -vz);
                }
            } else {
                this.velocity.x = 0;
                this.velocity.z = 0;
            }
        }
        
        // Update de mesh positie
        this.mesh.position.set(this.position.x, this.position.y + 0.9, this.position.z);
        
        // Voeg een zwevend effect toe aan de marker
        if (this.marker) {
            this.marker.position.y = 1.8 + Math.sin(Date.now() * 0.005) * 0.1;
        }
    }
    
    setTargetPosition(x, z) {
        this.targetPosition.x = x;
        this.targetPosition.z = z;
    }
    
    // Voor AI-besturing
    updateAI(ball) {
        if (!this.isPlayerControlled) {
            // Eenvoudige AI: volg de bal
            this.setTargetPosition(ball.position.x, ball.position.z);
        }
    }
}

// Exporteer de Player klasse voor gebruik in andere bestanden
window.Player = Player;
