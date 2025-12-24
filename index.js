const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// creating a collisions map for the collisions of the player-to-map boundaries

const collisionsMap = [];

for(let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70));
    // what this does is that it slices the whole collisions array into sub arrays, each containing 70 elements inside it.
    // and then pushes that sliced array into the collisionsMap array.
}

const battleZonesMap = [];
for(let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, i + 70));
}

const boundaries = [];

const offset = {
    x: -800,
    y: -100
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1025){
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
    })
})

const battleZones = [];
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1025){
            battleZones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
    })
})

const image = new Image();
image.src = './images/game_map.png';

const foregroundImage = new Image();
foregroundImage.src = './images/foregroundObjects.png';

const playerDownImage = new Image();
playerDownImage.src = './images/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './images/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './images/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './images/playerRight.png';


// playerImage.onload = () => {
//     context.drawImage(playerImage, 0, 0);
// } // Documented about it

// Player movement through keys



const player = new Sprite({
    position: {
        x: canvas.width / 2 - (192 / 3) / 1.75,
        y: canvas.height / 2 - 1 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {pressed: false},
    a: {pressed: false},
    s: {pressed: false},
    d: {pressed: false},
}
// this object is made to listen to the key pressed by the player and by default set the pressed property to be false.

const movables = [background, ...boundaries, foreground, ...battleZones];

function rectangularCollisions({rectangle1, rectangle2}){
    return(rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    );
}

const battle = {
    initiated: false
}

// now to animate our player image we initialise a function
function animate(){
    
    const animationId = window.requestAnimationFrame(animate);
    // what this does it that it takes a function as an argument and calls it recursively
    background.draw() // calls the draw function from the background object we created.

    boundaries.forEach((boundary) => {
        boundary.draw();        
    })

    battleZones.forEach((battleZone) => {
        battleZone.draw();
    })

    player.draw();
    
    foreground.draw();

    // now to animate our playerImage recursively, i have to shift the image.onload() function into my animate function
    
    let moving = true;
    player.animate = false; // line to stop the player movement when a battle is activated.

    if(battle.initiated) return;
    // This if statement checks for the collision between battle zone and player frame
    // also ensures the collision only happens when the overlapping area is greater by some value
    if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
        for(let i=0;i < battleZones.length;i++){
            const battleZone = battleZones[i];
            const overlappingArea = 
                (Math.min(
                    player.position.x + player.width, battleZone.position.x + battleZone.width
                ) - Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(
                    player.position.y + player.height, battleZone.position.y + battleZone.height
                ) - Math.max(player.position.y, battleZone.position.y))
        
            if(rectangularCollisions({
                    rectangle1: player,
                    rectangle2: battleZone
                }) && 
                overlappingArea > (player.width * player.height) / 2 &&
                Math.random() < 0.01
            ){
                window.cancelAnimationFrame(animationId);
                battle.initiated = true;
                gsap.to('#overlapping-div', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete(){
                        gsap.to('#overlapping-div', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete(){
                                // Activate a new animation loop
                                animateBattle();
                                gsap.to('#overlapping-div', {
                                    opacity: 0,
                                    duration: 0.4,
                                })
                            }
                        })
                    }
                })
                break;
            }
        }
    }

    if(keys.w.pressed && lastKey === 'w') {
        player.animate = true;
        player.image = player.sprites.up;
        for(let i=0;i < boundaries.length;i++){
            const boundary = boundaries[i];
            if(rectangularCollisions({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 3
                }}
            })){
                moving = false;
                break;
            }
        }

        if(moving){
            movables.forEach((movable) => {
                movable.position.y += 3
            })
        }
    } else if(keys.a.pressed && lastKey === 'a') {
        player.animate = true;
        player.image = player.sprites.left;
        for(let i=0;i < boundaries.length;i++){
            const boundary = boundaries[i];
            if(rectangularCollisions({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x + 3,
                    y: boundary.position.y
                }}
            })){
                moving = false;
                break;
            }
        }
        if(moving){
            movables.forEach((movable) => {
                movable.position.x += 3
            })
        }
    } else if(keys.s.pressed && lastKey === 's') {
        player.animate = true;
        player.image = player.sprites.down;
        for(let i=0;i < boundaries.length;i++){
            const boundary = boundaries[i];
            if(rectangularCollisions({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 3
                }}
            })){
                moving = false;
                break;
            }
        }

        if(moving){
            movables.forEach((movable) => {
                movable.position.y -= 3
            })
        }
    } else if(keys.d.pressed && lastKey === 'd') {
        player.animate = true;
        player.image = player.sprites.right;
        for(let i=0;i < boundaries.length;i++){
            const boundary = boundaries[i];
            if(rectangularCollisions({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x - 3,
                    y: boundary.position.y
                }}
            })){
                moving = false;
                break;
            }
        }

        if(moving) {
            movables.forEach((movable) => {
                movable.position.x -= 3
            })
        }
    }
    // these if else statements takes care of the background position when keys are being pressed
}
animate()
// now for our player to be animated everysingle time, we have to call this function recursively until a user asks to stop it

const battleBackgroundImage = new Image();
battleBackgroundImage.src = './images/battleBackground.png';
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
});

const dragonMonsterImage = new Image();
dragonMonsterImage.src = './images/draggleSprite.png';
const dragonMonster = new Sprite({
    position: {
        x: 800,
        y: 100
    },
    image: dragonMonsterImage,
    frames: {
        max: 4,
        hold: 30
    },
    animate: true
})

const embyMonsterImage = new Image();
embyMonsterImage.src = './images/embySprite.png';
const embyMonster = new Sprite({
    position: {
        x: 280,
        y: 325
    },
    image: embyMonsterImage,
    frames: {
        max: 4,
        hold: 30
    },
    animate: true
})

function animateBattle(){
    window.requestAnimationFrame(animateBattle);
    battleBackground.draw();
    dragonMonster.draw();
    embyMonster.draw();
}

// animateBattle();

lastKey = '';
window.addEventListener('keydown', (event) => {
    switch(event.key){
        case 'w' :
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 'a' :
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 's' :
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'd' :
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    }
})
window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'w' :
            keys.w.pressed = false
            break;
        case 'a' :
            keys.a.pressed = false
            break;
        case 's' :
            keys.s.pressed = false
            break;
        case 'd' :
            keys.d.pressed = false
            break;
    }
})