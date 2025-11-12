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

image.onload = () => {
    context.drawImage(image, -800, -100);
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
}

// playerImage.onload = () => {
//     context.drawImage(playerImage, 0, 0);
// } // Documented about it

// Player movement through keys
window.addEventListener('keydown', (event) => {
    switch(event.key){
        case 'w' :
            break;
        case 'a' :
            break;
        case 's' :
            break;
        case 'd' :
            break;
    }
})