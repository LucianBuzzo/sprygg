const storage = require('electron-json-storage');
const fs = require('fs');
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
let spritePath = null;

const watchFile = (path) => {
  fs.watchFile(path, () => {
    console.log('detected file change');
    loadSprite(path);
  });
};

const selectSpriteFile = function() {
  const [path] = dialog.showOpenDialog({
      properties: ['openFile']
  });

  console.log(path);

  storage.set('spritePath', path);
  loadSprite(path);
};

const loadSprite = (path) => {
  if (spritePath) {
    fs.unwatchFile(spritePath);
  }
  watchFile(path);
  spritePath = path;
  sprite = new Image();
  // Add a random query string here to act as a cache buster
  sprite.src = path + '?' + Math.random();
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

const init = () => {
  storage.get('spritePath', function(error, path) {
    if (error) {
      throw error;
    }

    if (typeof path === 'string') {
      loadSprite(path);
    }
  });
  main();
};

init();
