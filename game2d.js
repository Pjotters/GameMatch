class Game2D {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 800;
        this.height = 500;
        
        // Spelers en bal
        this.player1 = { x: 50, y: this.height/2 - 25, width: 20, height: 50, speed: 5, score: 0 };
        this.player2 = { x: this.width - 70, y: this.height/2 - 25, width: 20, height: 50, speed: 5, score: 0 };
        this.ball = { x: this.width/2, y: this.height/2, radius: 10, dx: 4, dy: 4 };
        
        // Besturing
        this.keys = {};
        
        // Initialisatie
        this.setupCanvas();
        this.setupEventListeners();
    }
    
    setupCanvas() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    
    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
    }
    
    update() {
        // Speler 1 besturing (W/S)
        if (this.keys['w'] && this.player1.y > 0) this.player1.y -= this.player1.speed;
        if (this.keys['s'] && this.player1.y < this.height - this.player1.height) this.player1.y += this.player1.speed;
        
        // Speler 2 besturing (pijltjes)
        if (this.keys['ArrowUp'] && this.player2.y > 0) this.player2.y -= this.player2.speed;
        if (this.keys['ArrowDown'] && this.player2.y < this.height - this.player2.height) this.player2.y += this.player2.speed;
        
        // Bal beweging
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Botsing met boven- en onderkant
        if (this.ball.y - this.ball.radius < 0 || this.ball.y + this.ball.radius > this.height) {
            this.ball.dy *= -1;
        }
        
        // Botsing met spelers
        this.checkCollision(this.player1);
        this.checkCollision(this.player2);
        
        // Score bijhouden
        if (this.ball.x < 0) {
            this.player2.score++;
            this.resetBall();
        }
        if (this.ball.x > this.width) {
            this.player1.score++;
            this.resetBall();
        }
    }
    
    checkCollision(player) {
        if (this.ball.x - this.ball.radius < player.x + player.width &&
            this.ball.x + this.ball.radius > player.x &&
            this.ball.y + this.ball.radius > player.y &&
            this.ball.y - this.ball.radius < player.y + player.height) {
            
            this.ball.dx *= -1.1; // Snelheid verhogen bij botsing
            
            // Bepaal hoek op basis van waar de bal de speler raakt
            const hitPos = (this.ball.y - (player.y + player.height/2)) / (player.height/2);
            this.ball.dy = hitPos * 5;
        }
    }
    
    resetBall() {
        this.ball.x = this.width / 2;
        this.ball.y = this.height / 2;
        this.ball.dx = (Math.random() > 0.5 ? 1 : -1) * 4;
        this.ball.dy = (Math.random() * 2 - 1) * 4;
    }
    
    draw() {
        // Wis het canvas
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Teken middenlijn
        this.ctx.strokeStyle = 'white';
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.width/2, 0);
        this.ctx.lineTo(this.width/2, this.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Teken spelers
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.player1.x, this.player1.y, this.player1.width, this.player1.height);
        this.ctx.fillRect(this.player2.x, this.player2.y, this.player2.width, this.player2.height);
        
        // Teken bal
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        
        // Teken score
        this.ctx.font = '30px Arial';
        this.ctx.fillText(this.player1.score, this.width/4, 50);
        this.ctx.fillText(this.player2.score, 3*this.width/4, 50);
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    start() {
        this.gameLoop();
    }
}
