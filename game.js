const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');
const playerPosition = {
    x: undefined,
    y: undefined,
};
const giftPosition = {
    x: undefined,
    y: undefined,
};

let enemyPositions = [];
let canvasSize;
let elementSize = canvasSize /10;

let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
window.addEventListener('keydown', (e) => {
    let tecla = e.key;
    switch(tecla){
        case "ArrowUp": moveUp();
        break;
        
        case "ArrowDown": moveDown();
        break;

        case "ArrowLeft": moveLeft();
        break;

        case "ArrowRight": moveRight();
        break;

        default: 
        break;
    }
})

function movePlayer() {
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;

    if(giftCollision){
       levelWin();
    }

    const enemyCollision = enemyPositions.find(enemy => {
       const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
       const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
       return enemyCollisionX && enemyCollisionY;
    });

    if (enemyCollision) {
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x , playerPosition.y);
}
function startGame() {
    game.font = elementSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];
    if(!map) {
        gameWin();
        return;
    }

    if(!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    showLives();

    enemyPositions = [];
    game.clearRect(0,0, canvasSize, canvasSize);

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementSize * (colI + 1);
            const posY = elementSize * (rowI + 1)

            if(col == 'O') {
                if(!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                }
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col == 'X') {
                enemyPositions.push({
                    x: posX,
                    y: posY,
                })
            }
            

            game.fillText(emoji, elementSize * (colI + 1), elementSize * (rowI + 1));
        });
    });

    movePlayer();
}
function setCanvasSize() {

    if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
    }

    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)

    elementSize = canvasSize /10;

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function levelWin () {
    console.log('Level Up')
    level ++;
    startGame();
}
function levelFail(){
    console.log('Chocaste con un enemigo')
    lives--;

    if(lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }
    
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
    
}
function gameWin(){
    console.log('Terminaste el juego')
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if(recordTime) {
        if(recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime)
            pResult.innerHTML = "Felicitaciones, nuevo record!";
        } else {
            pResult.innerHTML = "Lo siento, no superaste el record";
        }
    } else {
        localStorage.setItem('record_time', playerTime);
    }
}
function showLives(){
    spanLives.innerHTML = emojis['HEART'].repeat(lives);
}
function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}
function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
}

btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft)
btnRight.addEventListener('click', moveRight)
btnDown.addEventListener('click', moveDown)

function moveByKeys(event){
    if(event.key == 'ArrowUp'){
        moveUp();
    } else if (event.key == "ArrowLeft"){
        moveLeft();
    } else if (event.key == "ArrowRight"){
        moveRight();
    } else if (event.key == "ArrowDown"){
        moveDown();
    }
}
function moveUp() {
    console.log("Me movere hacia arriba");
    if((playerPosition.y - elementSize) < elementSize ) {

    } else {
        playerPosition.y -= elementSize;
        startGame();
    }
    
}
function moveLeft() {
    console.log("Me movere hacia izq");
    if((playerPosition.x - elementSize) < elementSize ) {

    } else {
        playerPosition.x -= elementSize;
        startGame();
    }
    
}
function moveRight() {
    console.log("Me movere hacia dere");
    if((playerPosition.x + elementSize) > canvasSize + 30) {

    } else {
        playerPosition.x += elementSize;
        startGame();
    }
    
}
function moveDown() {
    console.log("Me movere hacia aba");
    if((playerPosition.y + elementSize) > canvasSize + 30) {

    } else {
        playerPosition.y += elementSize;
        startGame();
    }
    
}