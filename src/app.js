window.onload = () => {
  console.log("ready");

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Personajes del juego
  let fps = new FPSViewer({ x: 5, y: 15 });

  // Mapa del juego
  let map = new Map();

  let initialPos = map.get_pacman_start();
  let pacman = new Pacman(initialPos, "yellow", 100, 9, map);
  let actors = [map, pacman, fps];

  // GAME LOOP -> BUCLE DE RENDERIZADO Y ACTUALIZACIÓN
  let lastFrame = 0;
  const render = (time) => {
    let delta = (time - lastFrame) / 1000;
    lastFrame = time;
    actors.forEach((actor) => actor.update(delta));
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    actors.forEach((actor) => actor.draw(delta, ctx));
    window.requestAnimationFrame(render);
  };

  //setInterval(render, frameTime);
  window.requestAnimationFrame(render);

  // Eventos de teclado
  document.body.addEventListener("keydown", (e) => {
    actors.forEach((actor) => actor.keyboard_event(e.key));
  });
};
