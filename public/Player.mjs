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

class Player {
  constructor({
    x = Math.floor((Math.random() * (screen_Width - (2 * h_width))) + h_width),
    y = Math.floor((Math.random() * (screen_Height - (2 * h_height))) + h_height),
    half_width = h_width,
    half_height = h_height,
    id }) {
      this.x = x;
      this.y = y;
      this.half_width = half_width;
      this.half_height = half_height;
      this.score = 0;
      this.id = id;
      this.movementData = {
        up: false,
        down: false,
        left: false,
        right: false
      };
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.rank = '';
  }


  setMovement(data) {
    this.movementData = data;
    return;
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case 'up':
        if (this.y - speed - this.half_height < 0) {
          this.y = this.half_height;
        } else {
          this.y -= speed;
        }
        break;
      case 'down':
        if (this.y + speed + this.half_height > screen_Height) {
          this.y = screen_Height - this.half_height;
        } else {
          this.y += speed;
        }
        break;
      case 'left':
        if (this.x - speed - this.half_width < 0) {
          this.x = this.half_width;
        } else {
          this.x -= speed;
        }
        break;
      case 'right':
        if (this.x + speed + this.half_width > screen_Width) {
          this.x = screen_Width - this.half_width;
        } else {
          this.x += speed;
        }
        break;
    }
    return;
  }

  collision(item) {
    return item.x + item.half_width > this.x - this.half_width &&
            item.x - item.half_width < this.x + this.half_width &&
            item.y + item.half_height > this.y - this.half_height &&
            item.y - item.half_height < this.y + this.half_height
  }

  calculateRank(arr) {
    const sorted = arr.sort(function(a, b){return b.score - a.score});
    let number = sorted.findIndex(val => val.id === this.id) + 1;
    this.rank = `Rank: ${number}/${arr.length}`;
    return this.rank;
  }
}

export default Player;
