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

class Boundary{
    static width = 48;
    static height = 48;
    constructor({position}){
        this.position = position;
        this.width = 48
        this.height = 48 
    }

    draw(){
        context.fillStyle = 'red';
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
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
const image = new Image();
image.src = './images/game_map.png';

const playerImage = new Image();
playerImage.src = './images/playerDown.png';



// playerImage.onload = () => {
//     context.drawImage(playerImage, 0, 0);
// } // Documented about it

// Player movement through keys

class Sprite{
    constructor({position, velocity, image}){
        this.position = position;
        this.image = image;
    }

    draw() {
        context.drawImage(this.image, this.position.x, this.position.y);
    }
}

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const keys = {
    w: {pressed: false},
    a: {pressed: false},
    s: {pressed: false},
    d: {pressed: false},
}
// this object is made to listen to the key pressed by the player and by default set the pressed property to be false.

// now to animate our player image we initialise a function
function animate(){
    
    window.requestAnimationFrame(animate);
    // what this does it that it takes a function as an argument and calls it recursively
    background.draw() // calls the draw function from the background object we created.

    boundaries.forEach(boundary => {
        boundary.draw();
    })

    context.drawImage(playerImage,
        0,
        0,
        playerImage.width / 4,
        playerImage.height,

        canvas.width / 2 - (playerImage.width / 3) / 1.75, 
        canvas.height / 2 - playerImage.height / 2,

        playerImage.width / 4,
        playerImage.height
    );
    // now to animate our playerImage recursively, i have to shift the image.onload() function into my animate function

    if(keys.w.pressed && lastKey === 'w') background.position.y += 3;
    else if(keys.a.pressed && lastKey === 'a') background.position.x += 3;
    else if(keys.s.pressed && lastKey === 's') background.position.y -= 3;
    else if(keys.d.pressed && lastKey === 'd') background.position.x -= 3;
    // these if else statements takes care of the background position when keys are being pressed
}
animate()
// now for our player to be animated everysingle time, we have to call this function recursively until a user asks to stop it

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