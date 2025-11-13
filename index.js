const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context.fillStyle = 'white'; 
context.fillRect(0, 0, canvas.width, canvas.height); 

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
        x: -800,
        y: -100
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

    if(keys.w.pressed) background.position.y += 3;
    else if(keys.a.pressed) background.position.x += 3;
    else if(keys.s.pressed) background.position.y -= 3;
    else if(keys.d.pressed) background.position.x -= 3;
    // these if else statements takes care of the background position when keys are being pressed
}
animate()
// now for our player to be animated everysingle time, we have to call this function recursively until a user asks to stop it

window.addEventListener('keydown', (event) => {
    switch(event.key){
        case 'w' :
            keys.w.pressed = true
            break;
        case 'a' :
            keys.a.pressed = true
            break;
        case 's' :
            keys.s.pressed = true
            break;
        case 'd' :
            keys.d.pressed = true
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