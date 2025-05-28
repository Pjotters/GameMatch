class Ball {
    constructor(scene) {
        this.scene = scene;
        this.position = { x: 0, y: 0.5, z: 0 };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.radius = 0.5;
        this.mass = 0.43; // Standaard voetbal gewicht in kg
        this.groundFriction = 0.99; // Wrijving met de grond
        this.airResistance = 0.99; // Luchtweerstand
        this.gravity = 0.002; // Zwaartekracht
        this.bounce = 0.7; // Terugkaatsing
        
        this.init();
    }
    
    init() {
        // Maak een voetbal met een patroon
        const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        
        // Maak een eenvoudig voetbalpatroon met texturen
        const textureLoader = new THREE.TextureLoader();
        const texture = this.createBallTexture();
        
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            bumpMap: texture,
            bumpScale: 0.05,
            shininess: 30,
            color: 0xffffff
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        this.reset();
        this.scene.add(this.mesh);
    }
    
    createBallTexture() {
        // Maak een eenvoudige voetbaltextuur
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        // Vul met witte achtergrond
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, 256, 256);
        
        // Teken zwarte vlakken (vereenvoudigd patroon)
        context.fillStyle = '#000000';
        
        // Teken een eenvoudig patroon van vijfhoeken (vereenvoudigd)
        this.drawPentagon(context, 128, 128, 100, 5);
        
        // Maak een texture van het canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    
    drawPentagon(ctx, x, y, radius, sides) {
        // Teken een eenvoudige vijfhoek
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        ctx.fill();
    }
    
    update(delta) {
        // Pas snelheid aan op basis van zwaartekracht en luchtweerstand
        this.velocity.y -= this.gravity * delta * 60;
        this.velocity.x *= this.airResistance;
        this.velocity.y *= this.airResistance;
        this.velocity.z *= this.airResistance;
        
        // Update positie
        this.position.x += this.velocity.x * delta * 60;
        this.position.y += this.velocity.y * delta * 60;
        this.position.z += this.velocity.z * delta * 60;
        
        // Controleer botsingen met de grond
        if (this.position.y < this.radius) {
            this.position.y = this.radius;
            this.velocity.y = -this.velocity.y * this.bounce;
            this.velocity.x *= this.groundFriction;
            this.velocity.z *= this.groundFriction;
        }
        
        // Controleer botsingen met de randen van het veld
        const fieldWidth = 52.5; // Halve breedte van het veld
        const fieldLength = 34;   // Halve lengte van het veld
        
        if (Math.abs(this.position.x) > fieldWidth - this.radius) {
            this.position.x = (this.position.x > 0 ? 1 : -1) * (fieldWidth - this.radius);
            this.velocity.x = -this.velocity.x * this.bounce;
        }
        
        if (Math.abs(this.position.z) > fieldLength - this.radius) {
            this.position.z = (this.position.z > 0 ? 1 : -1) * (fieldLength - this.radius);
            this.velocity.z = -this.velocity.z * this.bounce;
        }
        
        // Update de mesh positie
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        
        // Draai de bal op basis van de snelheid
        if (this.velocity.x !== 0 || this.velocity.z !== 0) {
            const rotationX = this.velocity.z * 0.1;
            const rotationZ = -this.velocity.x * 0.1;
            this.mesh.rotation.x += rotationX;
            this.mesh.rotation.z += rotationZ;
        }
    }
    
    kick(power, direction) {
        // Geef de bal een zet in de opgegeven richting met de opgegeven kracht
        const kickPower = power * 0.1; // Pas de kracht aan
        this.velocity.x = Math.sin(direction) * kickPower;
        this.velocity.z = Math.cos(direction) * kickPower;
        this.velocity.y = power * 0.05; // Voeg een beetje hoogte toe
    }
    
    reset() {
        // Reset de bal naar het midden
        this.position = { x: 0, y: 0.5, z: 0 };
        this.velocity = { x: 0, y: 0, z: 0 };
        
        if (this.mesh) {
            this.mesh.position.set(0, 0.5, 0);
            this.mesh.rotation.set(0, 0, 0);
        }
    }
}

// Exporteer de Ball klasse voor gebruik in andere bestanden
window.Ball = Ball;
