const screen_Width = 800;
const screen_Height = 600;
const h_width = 10;
const h_height = 10;

const colors = [
  'green',
  'blue',
  'red',
  'orange',
  'yellow',
  'purple',
  'pink'
]

class Collectible {
  constructor({
    x = Math.floor((Math.random() * (screen_Width - (2 * h_width))) + h_width),
    y = Math.floor((Math.random() * (screen_Height - (2 * h_height))) + h_height),
    half_width = h_width,
    half_height = h_height,
    value,
    id
  }) {
    this.x = x;
    this.y = y;
    this.half_width = half_width;
    this.half_height = half_height;
    this.value = value;
    this.id = id;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }


}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
