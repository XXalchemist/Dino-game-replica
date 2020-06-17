const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


// Variables

let score;
let scoreText;
let highscoreText;
let highscore;
let player;
let gravity;
let obstacles = [];
let gameSpeed = 0;
let keys = {};


// Event Listeners

document.addEventListener('keydown', function (evt) {
    keys[evt.code] = true;
});

document.addEventListener('keyup', function (evt){
    keys[evt.code] = false;
});

class Player {
    constructor (x,y,w,h,c) {

        this.x = x;
        this.y = y;
        this.c = c;
        this.h = h;
        this.w = w;

        this.dy = 0;
        this.jumpForce = 15;
        this.originalHeight = h;
        this.grounded = false;
    }

    Draw () {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();

    }

    Animate () {
        //Jump animate
        if (keys['Space'] || keys['KeyW']) {

            this.Jump();

        }
        else {
            this.jumpTimer = 0;
        }

        if (keys['KeyS'] || keys['ShiftLeft']){
            this.h = this.originalHeight/2;
        }
        else{
            this.h = this.originalHeight;
        }

        this.y += this.dy;
        // Gravity
        if (this.y + this.h < canvas.height){
            this.dy += gravity;
            this.grounded = false;
        } else {
            this.dy = 0;
            this.grounded = true;
            this.y = canvas.height - this.h;
        }
        this.Draw();

    }

    Jump () {
        if(this.grounded && this.jumpTimer == 0){
            this.jumpTimer = 1;
            this.dy = -this.jumpForce;
        }
        else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
            this.jumpTimer++;
            this.dy = -this.jumpForce - (this.jumpTimer / 50);
        }
    }

}   

class Obstacle {
    constructor (x,y,w,h,c){
        this.x = x;
        this.y = y;
        this.c = c;
        this.w = w;
        this.h = h;

        this.dx = -gameSpeed; //velocity of obs
        
    }

    Update () {
        this.x += this.dx;
        this.Draw();
        this.dx = -gameSpeed ;
    }
    Draw () {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();
    }

}

class Text {
    constructor(tex,x,y,a,c,s){
        this.tex = tex;
        this.a = a;
        this.c = c;
        this.s = s;
        this.x = x;
        this.y = y;
    }

    Draw () {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.font = this.s + "px sans-serif";
        ctx.textAlign = this.a;
        ctx.fillText(this.tex, this.x, this.y);
        ctx.closePath();
    }
}

// Game Functions
function SpawnObstacle () {
    let size = RandomIntInRange(20,70);
    console.log(size)
    let type = RandomIntInRange(0,1);
    console.log(canvas.width)

    let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size, '#2484E4');

    if (type==1){
        obstacle.y -= player.originalHeight -10;
    }
    obstacles.push(obstacle);
}


function RandomIntInRange (min, max){
    return Math.round(Math.random()* (max-min) +min);
}
 function Start () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.font = "20px sans-serif";

    gamespeed = 3;
    gravity = 1;

    score = 0;
    highscore = 0;

    if (localStorage.getItem('highscore')){
        highscore = localStorage.getItem('highscore');
    }

    player = new Player(25, canvas.height -150, 50, 50, '#FF5859');
    highscoreText = new Text ("Highscore: " + highscore, canvas.width - 25, 25,"right", "#212121", 20);
    scoreText = new Text("Score: " + score, 25 ,25, "left", '#212121');
    requestAnimationFrame(Update);


    
    

}

let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;

function Update () {
    requestAnimationFrame(Update);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // helps in getting square not dragged square


    spawnTimer--;
    if (spawnTimer <= 0){
        SpawnObstacle();
        console.log(obstacles);
        spawnTimer = initialSpawnTimer - gameSpeed * 8;

        if (spawnTimer < 60) {
            spawnTimer = 60;
        }
    }

    // Spawn Enemy
    for (let i=0 ; i < obstacles.length ; i++){
        let o = obstacles[i];

        if (o.x + o.width < 0){
            obstacles.splice(i,1);
        }
        if (player.x < o.x + o.w && player.x + player.w>o.x && player.y < o.y +o.h && player.y + player.h >o.y){
            obstacles = [];
            score = 0;
            spawnTimer = initialSpawnTimer;
            window.localStorage.setItem("highscore",highscore);
            gamespeed = 3;
        }
        o.Update();
    }
    
    player.Animate();
    score++;
    scoreText.tex = "Score: "+score ;
    scoreText.Draw();
    highscoreText.Draw();

    if (score > highscore) {
        highscore = score;
        highscoreText.tex = "Highscore: " + highscore;
        
    }

    gameSpeed +=0.003;
    

}

Start();
