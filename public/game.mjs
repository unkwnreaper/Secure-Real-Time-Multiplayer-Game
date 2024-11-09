import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io({transports: ['websocket']});
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');


/* ************************* */
/* ******** my code ******** */
/* ************************* */

const rank = document.getElementById('rank');

// new player

socket.emit('new player');


// draw update

socket.on('state', function(players, item) {
    context.clearRect(0, 0, 800, 600);
    context.fillStyle = item.color;
    context.fillRect(item.x - item.half_width, item.y - item.half_height, item.half_width * 2, item.half_height * 2);
    for (var index in players) {
        let player = players[index];
        context.fillStyle = player.color;
        context.beginPath();
        context.arc(player.x, player.y, (player.half_width + player.half_height) / 2, 0, 2 * Math.PI);
        context.fill();
    }
});

// rank update

socket.on('update rank', function(players) {
    let player = players.find(idx => idx.id === socket.id);
    rank.innerText = player.rank;
});

// movement data

let movement = {
    up: false,
    down: false,
    left: false,
    right: false
}

setInterval(function() {
    socket.emit('movement', movement);
}, 1000 / 60 );


document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'ArrowLeft':
        case 'A':
        case 'a':
            movement.left = true;
            break;
        case 'ArrowUp':
        case 'W':
        case 'w':
            movement.up = true;
            break;
        case 'ArrowRight':
        case 'D':
        case 'd':
            movement.right = true;
            break;
        case 'ArrowDown':
        case 'S':
        case 's':
            movement.down = true;
            break;
    
    }
});
document.addEventListener('keyup', function(event) {
    switch (event.key) {
        case 'ArrowLeft':
        case 'A':
        case 'a':
            movement.left = false;
            break;
        case 'ArrowUp':
        case 'W':
        case 'w':
            movement.up = false;
            break;
        case 'ArrowRight':
        case 'D':
        case 'd':
            movement.right = false;
            break;
        case 'ArrowDown':
        case 'S':
        case 's':
            movement.down = false;
            break;
    }
});