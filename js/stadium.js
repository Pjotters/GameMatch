class Stadium {
    constructor(scene) {
        this.scene = scene;
        this.createField();
        this.createStands();
        this.createGoals();
    }
    
    createField() {
        // Speelveld
        const fieldGeometry = new THREE.PlaneGeometry(68, 105, 1, 1);
        const fieldMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2E8B57,
            roughness: 0.8,
            metalness: 0.2
        });
        
        this.field = new THREE.Mesh(fieldGeometry, fieldMaterial);
        this.field.rotation.x = -Math.PI / 2;
        this.field.receiveShadow = true;
        this.field.position.y = 0.01; // Net boven de grond
        this.scene.add(this.field);
        
        // Witte lijnen
        this.createFieldLines();
    }
    
    createFieldLines() {
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        
        // Buitenlijnen
        const outerLines = [
            // Buitenlijn
            { points: [
                new THREE.Vector3(-52.5, 0.1, -34),
                new THREE.Vector3(52.5, 0.1, -34),
                new THREE.Vector3(52.5, 0.1, 34),
                new THREE.Vector3(-52.5, 0.1, 34),
                new THREE.Vector3(-52.5, 0.1, -34)
            ] },
            // Middenlijn
            { points: [
                new THREE.Vector3(0, 0.1, -34),
                new THREE.Vector3(0, 0.1, 34)
            ] },
            // Middencirkel
            { points: this.createCirclePoints(9.15, 32) }
        ];
        
        outerLines.forEach(line => {
            const geometry = new THREE.BufferGeometry().setFromPoints(line.points);
            const lineMesh = new THREE.Line(geometry, lineMaterial);
            this.scene.add(lineMesh);
        });
    }
    
    createCirclePoints(radius, segments) {
        const points = [];
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(theta) * radius,
                0.1,
                Math.sin(theta) * radius
            ));
        }
        return points;
    }
    
    createStands() {
        // Eenvoudige tribunes rond het veld
        const standGeometry = new THREE.BoxGeometry(120, 20, 80);
        const standMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.7,
            roughness: 0.3
        });
        
        // Onderste ring tribunes
        const bottomStand = new THREE.Mesh(standGeometry, standMaterial);
        bottomStand.position.y = -10;
        bottomStand.position.z = 0;
        bottomStand.scale.set(1, 0.2, 1.2);
        this.scene.add(bottomStand);
        
        // Bovenste ring tribunes
        const topStand = bottomStand.clone();
        topStand.position.y = 10;
        topStand.scale.set(1.2, 0.2, 1.4);
        this.scene.add(topStand);
        
        // Voeg wat publiek toe (eenvoudige blokken voor nu)
        for (let i = 0; i < 100; i++) {
            const person = new THREE.Mesh(
                new THREE.BoxGeometry(0.5, 1, 0.2),
                new THREE.MeshStandardMaterial({ 
                    color: Math.random() * 0xffffff,
                    metalness: 0.2,
                    roughness: 0.8
                })
            );
            
            // Plaats willekeurig in de tribunes
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 20;
            
            person.position.x = Math.cos(angle) * distance;
            person.position.y = 5 + Math.random() * 8;
            person.position.z = Math.sin(angle) * distance * 0.6;
            
            this.scene.add(person);
        }
    }
    
    createGoals() {
        const goalMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            wireframe: true
        });
        
        // Doel aan de linkerkant
        const leftGoal = this.createGoalMesh();
        leftGoal.position.set(-52.5, 2.44, 0);
        this.scene.add(leftGoal);
        
        // Doel aan de rechterkant
        const rightGoal = this.createGoalMesh();
        rightGoal.rotation.y = Math.PI;
        rightGoal.position.set(52.5, 2.44, 0);
        this.scene.add(rightGoal);
    }
    
    createGoalMesh() {
        const group = new THREE.Group();
        
        // Doelpalen en lat
        const postGeometry = new THREE.BoxGeometry(0.1, 2.44, 0.1);
        const crossbarGeometry = new THREE.BoxGeometry(7.32, 0.1, 0.1);
        
        // Linkerpaal
        const leftPost = new THREE.Mesh(postGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
        leftPost.position.set(0, 1.22, -3.66);
        group.add(leftPost);
        
        // Rechterpaal
        const rightPost = leftPost.clone();
        rightPost.position.z = 3.66;
        group.add(rightPost);
        
        // Lat
        const crossbar = new THREE.Mesh(crossbarGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
        crossbar.position.set(0, 2.44, 0);
        group.add(crossbar);
        
        // Net (eenvoudige weergave)
        const netMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
        const netGeometry = new THREE.BoxGeometry(7.32, 2.44, 4);
        const net = new THREE.LineSegments(
            new THREE.EdgesGeometry(netGeometry),
            netMaterial
        );
        net.position.set(0, 1.22, 0);
        group.add(net);
        
        return group;
    }
}

// Exporteer de Stadium klasse voor gebruik in andere bestanden
window.Stadium = Stadium;
