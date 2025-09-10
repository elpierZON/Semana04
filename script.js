const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Cargar el sonido de la moneda
const coinSound = new Audio('monedaa.mp3');

//Objeto para prastrear las teclas presionadas
let keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

//definicion del jugador
const player = {x: 50, y: 50, w: 30, h: 30, color: 'red', speed: 2.5 };

//definicon de los niveklescon obstaculo y monedas

const levels = [
    {
        obstacles: [
            {x: 100, y: 150, w: 400, h: 20},
            {x: 300, y: 250, w: 20, h: 200}
        ],
        coins: [
            {x: 500, y: 50,  collected: false},
            {x: 50, y: 300,  collected: false}
        ]
    },
    {
        obstacles: [
            {x: 200, y: 100, w: 200, h: 20},
            {x: 200, y: 200, w: 20, h: 100},
            {x: 400, y: 200, w: 20, h: 100}
        ],
        coins: [
            {x: 50, y: 50,  collected: false},
            {x: 550, y: 350,  collected: false},
            {x: 500, y: 180,  collected: false}
        ]
    },
    {
    obstacles: [
        // plataforma horizontal superior
        { x: 60,  y: 80,  w: 520, h: 20 },
        // “paredes” que obligan a rodear
        { x: 150, y: 160, w: 20,  h: 140 },
        { x: 470, y: 160, w: 20,  h: 140 },
        // plataforma inferior
        { x: 100, y: 320, w: 440, h: 20 }
    ],
    coins: [
        { x: 80,  y: 50,  collected: false },
        { x: 560, y: 50,  collected: false },
        { x: 320, y: 190, collected: false },
        { x: 120, y: 290, collected: false },
        { x: 520, y: 290, collected: false }
    ]
}


];

//indice del nuvel actual 
let currentLevel = 0;

//funcion para detectar colisiones entre dos rectangulos

function rectsCollide(a,b){
    return(
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
    );
}

//funcion para dibujar un rectangulo (jugador u obstaculo)
function drawRect(obj){
    ctx.fillStyle = obj.color || 'white';
    ctx.fillRect(obj.x,obj.y,obj.w,obj.h);
}

function clampPlayerToCanvas() {
  // Limita X
    if (player.x < 0) player.x = 0;
    if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;

    // Limita Y
    if (player.y < 0) player.y = 0;
    if (player.y + player.h > canvas.height) player.y = canvas.height - player.h;
}


//funcikon que actualiza la logica del juego
function update(){
    const level = levels[currentLevel]

    //movimiento del jugador segun las teclas presionadas
    if(keys['ArrowUp']) player.y -= player.speed;
    if(keys['ArrowDown']) player.y += player.speed;
    if(keys['ArrowLeft']) player.x -= player.speed;
    if(keys['ArrowRight']) player.x += player.speed;
    clampPlayerToCanvas();

    //comprobacion de colision con obstaculos y retroces del movimiento

    for(let obs of level.obstacles){
        if(rectsCollide(player,obs)){
            if(keys['ArrowUp']) player.y += player.speed;
            if(keys['ArrowDown']) player.y -= player.speed;
            if(keys['ArrowLeft']) player.x += player.speed;
            if(keys['ArrowRight']) player.x -= player.speed;
            clampPlayerToCanvas();
        }

    }

    //comprobacion de colision con monedas y recoleccion

    for(let coin of level.coins){
        if(!coin.collected){
            if(
            player.x < coin.x + 15 &&
            player.x + player.w > coin.x &&
            player.y < coin.y + 15 &&
            player.y + player.h > coin.y
            ){
                coin.collected = true; //marca la moneda como recogida
                // Reproducir sonido de moneda
                coinSound.currentTime = 0; // Reinicia el audio para permitir sonidos consecutivos
                coinSound.play().catch(e => console.log('Error al reproducir sonido:', e));
            }
        }
    }
    
    //VERIFICA SI TODAS LAS MONEDAS DEL NIVEL HAN SIDO RECOGIDAS
    const allCollected = level.coins.every(c=>c.collected);
    if(allCollected){
        if(currentLevel < levels.length -1){
            currentLevel++ //avanza al siguiente nivel
            resetLevel();
        }else{
            //fin del jueg: muestra mensae y reinicia
            alert("FELICITACIONES!, PIERO MAUTINO")
            currentLevel = 0;
            resetLevel();
        }
    }
}

function resetLevel(){
    player.x = 50;
    player.y = 50;
    levels[currentLevel].coins.forEach(c =>c.collected = false);

}

//funcion que dibuja los elementos del juego
function draw(){
    //liempia al lienzp
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //dibuja jugadr
    drawRect(player);

    const level = levels[currentLevel];

    //DIBUJA LOS OBSTACULOS
    for(let obs of level.obstacles){
        drawRect({...obs,color: 'gray'});

    }

    // Dibuja las monedas (sin HUD adentro)
    for (let coin of level.coins) {
    if (!coin.collected) {
        ctx.fillStyle = 'gold';
        ctx.beginPath();
        ctx.arc(coin.x + 7.5, coin.y + 7.5, 7.5, 0, Math.PI * 2);
        ctx.fill();
    }
}
// HUD (fuera del bucle)
ctx.fillStyle = 'white';
ctx.font = '16px sans-serif';
ctx.fillText(`Nivel: ${currentLevel + 1}`, 10, 20);


}
//bucle principal del juego (actualiza yu dibuja en cada frrame)
function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
resetLevel();
gameLoop();


