const angleToRad = (angle) => (angle * Math.PI) / 180;

class Pacman extends Actor {
  constructor(
    initialPos,
    color = "yellow",
    maxSpeed = 100,
    pacmanSize = 25,
    map
  ) {
    super(initialPos);
    this.pacmanSize = pacmanSize;
    this.mouthOpen = 2;
    this.color = color;
    this.maxSpeed = maxSpeed;
    this.speed = { x: 0, y: 0 };
    this.map = map;
  }

  update(deltaSeconds) {
    //console.log("updatePacman, mouthOpen", this.mouthOpen);

    this.mouthOpen += 0.8;
    let newPosX = this.position.x + this.speed.x * deltaSeconds;
    let newPosY = this.position.y + this.speed.y * deltaSeconds;

    // Check pacman collision with the map
    let direction = this.get_direction();
    let tip = {
      x: this.position.x - direction[0] * this.pacmanSize,
      y: this.position.y - direction[1] * this.pacmanSize,
    };
    let tile = this.map.tile(tip, direction);
    if (tile == "1" || tile == "2" || tile == "3" || tile == "4") {
      let teleportPos = this.map.get_oposite_teleport(tile);
      console.log("teleported", teleportPos);
      this.position = teleportPos;
      return;
    } else if (tile != "W") {
      //console.log("WALL");
      this.position.x = newPosX;
      this.position.y = newPosY;
    }
    this.map.eat(this.position);
  }

  keyboard_event(key) {
    switch (key) {
      case "ArrowLeft":
        this.speed.x = -this.maxSpeed;
        this.speed.y = 0;
        break;
      case "ArrowRight":
        this.speed.x = this.maxSpeed;
        this.speed.y = 0;
        break;
      case "ArrowUp":
        this.speed.y = -this.maxSpeed;
        this.speed.x = 0;
        break;
      case "ArrowDown":
        this.speed.y = this.maxSpeed;
        this.speed.x = 0;
        break;
    }
  }

  get_direction() {
    // Calculate direction based on speed
    let direction = [1, 0];
    if (this.speed.x != 0 && this.speed.x < 0) {
      direction = [-1, 0];
    }
    if (this.speed.y != 0 && this.speed.y > 0) {
      direction = [0, 1];
    }
    if (this.speed.y != 0 && this.speed.y < 0) {
      direction = [0, -1];
    }
    return direction;
  }

  draw(delta, ctx) {
    let origin = this.position;
    let open = 20 * Math.sin(10 * this.mouthOpen * delta) + 20;
    let direction = this.get_direction();

    let degrees = Math.atan2(direction[1], direction[0]);

    ctx.strokeStyle = "black";
    ctx.fillStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.arc(
      origin.x,
      origin.y,
      this.pacmanSize,
      angleToRad(-open) + degrees,
      angleToRad(open) + degrees,
      true
    );
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
}
