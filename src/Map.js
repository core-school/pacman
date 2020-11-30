let pacmanMap = `
0000000000W3W0000000000000000000
0000000000WDW0000000000000000000
00WWWWWWWWW WWWWWWWWWWWWWWWWWW00
00W........S...WW............W00
00W.WWWW.WWWWW.WW.WWWWW.WWWW.W00
00W*W....W   W.WW.W   W.W...*W00
00W.W....W   W.WW.WWWWW.WWWW.W00
00W.W....W   W....W.W...W....W00
00W.W....W   W.WW.W..W..W....W00
00W.WWWW.WWWWW.WW.W...W.WWWW.W00
00W............WW............W00
00WWWWWW.WWWWW.WW.WWWWW.WWWWWW00
00WWWWWW.WWWWW.WW.WWWWW.WWWWWW00
00WWWWWW.WW..........WW.WWWWWW00
00WWWWWW.WW.WWW--WWW.WW.WWWWWW00
0WWWWWWW.WW.WooooooW.WW.WWWWWWW0
1B..........WooooooW..........A2
0WWWWWWW.WW.WooooooW.WW.WWWWWWW0
00WWWWWW.WW.WWWWWWWW.WW.WWWWWW00
00WWWWWW.WW..........WW.WWWWWW00
00WWWWWW.WW.WWWWWWWW.WW.WWWWWW00
00WWWWWW.WW.WWWWWWWW.WW.WWWWWW00
00W............WW............W00
00W.WWWW.WWWWW.WW.WWWWW.WWWW.W00
00W*WWWW.WWWWW.WW.WWWWW.WWWW*W00
00W...WW................WW...W00
00WWW.WW.WW.WWWWWWWW.WW.WW.WWW00
00WWW.WW.WW.WWWWWWWW.WW.WW.WWW00
00W......WW....WW....WW......W00
00W.WWWWWWWWWW.WW.WWWWWWWWWW.W00
00W.WWWWWWWWWW.WW.WWWWWWWWWW.W00
00W..........................W00
00WWWWWWWWWWWWWWWWW WWWWWWWWWW00
000000000000000000WCW00000000000
000000000000000000W4W00000000000
`;

class Map extends Actor {
  constructor(tileSize = 20) {
    super({ x: -tileSize * 2, y: -tileSize * 2 });
    this.tileSize = tileSize;
    let rows = pacmanMap.trim().split("\n");
    this.map = rows.map((row) => row.split(""));
    console.log("Map size", rows[0].length, this.map.length);
  }

  get_pacman_start() {
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        if (this.map[i][j] == "S") {
          return {
            x: this.position.x + this.tileSize * j + this.tileSize / 2,
            y: this.position.y + this.tileSize * i + this.tileSize / 2,
          };
        }
      }
    }
    throw new Error("Set the S for pacman start");
  }

  pos_to_tile(position) {
    let i = Math.floor((position.x - this.position.x) / this.tileSize);
    let j = Math.floor((position.y - this.position.y) / this.tileSize);
    return [j, i];
  }
  tile_at_index(tileIndex) {
    try {
      let tile = this.map[tileIndex[0]][tileIndex[1]];
      return tile;
    } catch (error) {
      console.log("out of bounds");
      return false;
    }
  }

  get_oposite_teleport(origin_teleport) {
    const destination_tile = String.fromCharCode(
      64 + parseInt(origin_teleport)
    );
    console.log(origin_teleport, destination_tile);
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        if (this.map[i][j] == destination_tile) {
          return {
            x: this.position.x + this.tileSize * j + this.tileSize / 2,
            y: this.position.y + this.tileSize * i + this.tileSize / 2,
          };
        }
      }
    }
    throw new Error("not found teleport destination");
  }

  eat(position) {
    let tileIndex = this.pos_to_tile(position);
    let tile = this.tile_at_index(tileIndex);
    if (tile == "." || tile == "*") {
      this.map[tileIndex[0]][tileIndex[1]] = " ";
    }
  }

  tile(position, direction) {
    let tileIndex = this.pos_to_tile(position);
    let facing = [tileIndex[0] + direction[1], tileIndex[1] + direction[0]];
    let tile = this.tile_at_index(facing);
    return tile;
  }

  draw_wall(ctx, i, j) {
    ctx.fillStyle = "lightgray";
    ctx.fillRect(
      this.position.x + j * this.tileSize,
      this.position.y + i * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }

  draw_dot(ctx, i, j, type = "normal") {
    ctx.strokeStyle = "black";
    ctx.fillStyle = type == "normal" ? "yellow" : "red";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(
      this.position.x + j * this.tileSize + this.tileSize / 2,
      this.position.y + i * this.tileSize + this.tileSize / 2,
      type == "normal" ? this.tileSize / 6 : this.tileSize / 4,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  draw(delta, ctx) {
    /* Fill the code */
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        let cell = this.map[i][j];
        if (cell == "W") this.draw_wall(ctx, i, j);
        if (cell == ".") this.draw_dot(ctx, i, j);
        if (cell == "*") this.draw_dot(ctx, i, j, "super");
      }
    }
  }
}
