const storage = require('electron-json-storage');
const {dialog} = require('electron').remote;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let timeout = 1000 / 10;
let tick = 0;
let spriteWidth = 32;

ctx.imageSmoothingEnabled = false;

canvas.width = 32;
canvas.height = 32;

canvas.style.width = '128px';
canvas.style.height = '128px';

let sprite = null;

const selectSpriteFile = function() {
  const [path] = dialog.showOpenDialog({
      properties: ['openFile']
  });

  console.log(path);

  sprite = new Image();
  sprite.src = path;
  sprite.onload = function() {
    console.log(sprite.clientWidth);
    console.log(sprite.clientHeight);
  };
};

document.querySelector('.open-file').addEventListener('click', selectSpriteFile, false);

const main = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (sprite) {
    ctx.drawImage(
      sprite,
      spriteWidth * tick,
      0,
      32,
      32,
      0,
      0,
      canvas.width,
      canvas.height
    );

    tick++;
    if (spriteWidth * tick >= sprite.width) {
      tick = 0;
    }
  }


  setTimeout(main, timeout);
};

main();
