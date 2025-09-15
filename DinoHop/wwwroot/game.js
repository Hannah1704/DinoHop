window.DinoGame = {
    canvas: null,
    ctx: null,
    dino: { x: 50, y: 150, width: 30, height: 30, velocityY: 0 },
    gravity: 0.6,
    isJumping: false,
    obstacles: [],
    obstacleSpeed: 4,
    score: 0,
    gameState: 'start',

    // images needed for dino and cactus
    dinoImg: new Image(),
    cactusImg: new Image(),

    // -----------------------------------------------------------
    init: function (){
        this.canvas= document.getElementById('gameCanvas');
        this.ctx= this.canvas.getContext('2d');

        document.addEventListener('keydown',(e) => {
            if(this.gameState=== 'start') 
            {
                if(e.code==='Space') 
                {
                    this.startGame();
                }
            } 
            else if(this.gameState=== 'playing') 
            {
                if(e.code=== 'Space' && !this.isJumping) 
                {
                    this.dino.velocityY = -12;
                    this.isJumping = true;
                }
            }
        });

        this.loop();

        // images for the assets - change path as needed for your images
        this.dinoImg.src= '/images/dino.png';
        this.cactusImg.src= '/images/cactus.jpeg';
        this.bgImg= new Image();
        this.bgImg.src= '/images/sky.jpg';


    },

    // -----------------------------------------------------------
    startGame: function (){
        this.gameState= 'playing';
        this.obstacles= [];
        this.score= 0;
        this.dino.y= 150;
        this.dino.velocityY= 0;
        this.isJumping= false;
        this.spawnInterval= setInterval(() => this.spawnObstacle(), 2000);
    },

    spawnObstacle: function (){
        if(this.gameState!== 'playing')
        {
            return;
        }

        const height= 30;
        this.obstacles.push({x: this.canvas.width, y: 150, width: 20, height: height });
    },

    // -----------------------------------------------------------
    loop: function (){
        requestAnimationFrame(()=> this.loop());

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if(this.gameState=== 'start') 
        {
            this.drawStartScreen();
            return;
        }

        this.dino.velocityY += this.gravity;
        this.dino.y += this.dino.velocityY;
        if(this.dino.y >= 150) 
        {
            this.dino.y= 150;
            this.dino.velocityY= 0;
            this.isJumping= false;
        }

        for(let i= 0; i < this.obstacles.length; i++) 
        {
            this.obstacles[i].x-= this.obstacleSpeed;
        }

        for(let obs of this.obstacles) 
        {
            if(
                this.dino.x < obs.x + obs.width &&
                this.dino.x + this.dino.width > obs.x &&
                this.dino.y < obs.y + obs.height &&
                this.dino.y + this.dino.height > obs.y
            ) 
            {
                alert(`Dino hit a cactus! Score: ${this.score}`);
                this.resetGame();
                return;
            }
        }

        this.obstacles= this.obstacles.filter(obs => obs.x + obs.width > 0);
        this.score+= 1;
        this.draw();
    },

    // -----------------------------------------------------------
    draw: function (){
        this.ctx.drawImage(this.bgImg, 0, 0, this.canvas.width, this.canvas.height);
        
        // GROUND
        this.ctx.fillStyle = '#bc7732ff';
        this.ctx.fillRect(0, 180, this.canvas.width, 20);

        //DINO
        this.ctx.drawImage(this.dinoImg, this.dino.x, this.dino.y, this.dino.width, this.dino.height);

        //OBSTACLES
        for(let obs of this.obstacles) 
        {
            this.ctx.drawImage(this.cactusImg, obs.x, obs.y, obs.width, obs.height);
        }

        //SCORE
        this.ctx.fillStyle= 'black';
        this.ctx.font= '16px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 60, 30);
    },

    // -----------------------------------------------------------
    drawStartScreen: function (){
        this.ctx.fillStyle= 'black';
        this.ctx.font= '20px Arial';
        this.ctx.textAlign= 'center';

        this.ctx.fillText('Dino Hop', this.canvas.width / 2, 80);
        this.ctx.font= '16px Arial';
        this.ctx.fillText('Press SPACE to jump', this.canvas.width / 2, 120);
        this.ctx.fillText('Avoid the cactus!', this.canvas.width / 2, 150);
        this.ctx.fillText('Press SPACE to Start', this.canvas.width / 2, 180);
    },

    // -----------------------------------------------------------
    resetGame: function (){
        clearInterval(this.spawnInterval);
        this.gameState= 'start';
        this.obstacles= [];
        this.score= 0;
        this.dino.y= 150;
        this.dino.velocityY= 0;
        this.isJumping= false;
    }
};
