require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const cors = require('cors');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();


// ******         Helmet         *******
const helmet = require('helmet');

app.use(
  helmet({
    xPoweredBy: false,
    xXssProtection: true,
    noCache: true
  })
);

app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "PHP 7.4.3");
  next();
});

// ******      Helmet       *******



app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});


const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing


/* ************************* */
/* ******** my code ******** */
/* ************************* */

const Player = require('./public/Player.mjs');
const Collectible = require('./public/Collectible.mjs');
const socketIO = require('socket.io');

const io = socketIO(server);
io.set('transports', ['websocket']);

// Add the WebSocket handlers
let players = [];
let speed = 5;
let item = null;

setInterval(function() {
  if (players) {
    for (let player of players) {
      if (player.movementData.up) {
        player.movePlayer('up', speed);
      }
      if (player.movementData.down) {
        player.movePlayer('down', speed);
      }
      if (player.movementData.left) {
        player.movePlayer('left', speed);
      }
      if (player.movementData.right) {
        player.movePlayer('right', speed);
      }
    }
  }
}, 1000 / 60);

io.on('connection', function(socket) {
  socket.on('new player', function() {
    players.push(new Player.default({
      id: socket.id
    }));
  });
  socket.on('movement', function(data) {
    let player = players.find(idx => idx.id === socket.id) || null;
    if (player) {
      if (data) {
        player.setMovement(data);
      }
      if (item && player.collision(item)) {
        player.score += item.value;
        item = null;
        for (let idx in players) {
          players[idx].calculateRank(players);
        }
        io.sockets.emit('update rank', players);
      }
    }
  });

  socket.on('disconnect', function() {
    // remove disconnected player
    playerIndex = players.findIndex(idx => idx.id === socket.id);
    if (playerIndex >= 0) {
      players.splice(playerIndex, 1);
    }
  });

});

setInterval(function() {
  if (item == null) {
    item = new Collectible({
    id: Math.floor(Math.random() * 1000000),
    value: Math.floor(Math.random() * 5)
  });}
  io.sockets.emit('state', players, item);
}, 1000 / 60);


/* ************************* */
/* ****** my code end ****** */
/* ************************* */