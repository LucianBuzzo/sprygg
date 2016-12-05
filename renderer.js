const storage = require('electron-json-storage');
const fs = require('fs');
const {dialog} = require('electron').remote;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

/**
 * @desc Options object used for controlling how the sprite is displayed
 * @type {Object}
 */
let options = {
  fps: 10,
  height: 32,
  width: 32
};

let tick = 0;

ctx.imageSmoothingEnabled = false;

canvas.width = options.width;
canvas.height = options.height;

canvas.style.width = options.width * 4 + 'px';
canvas.style.height = options.height * 4 + 'px';

let sprite = null;
let spritePath = null;

const setWidth = (width) => {
  options.width = width;
  canvas.width = options.width;
  canvas.style.width = options.width * 4 + 'px';
};

const setHeight = (height) => {
  options.height = height;
  canvas.height = options.height;
  canvas.style.height = options.height * 4 + 'px';
};

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
      options.width * tick,
      0,
      options.width,
      options.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    tick++;
    if (options.width * tick >= sprite.width) {
      tick = 0;
    }
  }


  setTimeout(main, 1000 / options.fps);
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

const frameWidthElem = document.getElementById('frame-width');
const frameHeightElem = document.getElementById('frame-height');
const fpsElem = document.getElementById('fps');

const handleWidthChange = function() {
  setWidth(frameWidthElem.value);
};
const handleHeightChange = function() {
  setHeight(frameHeightElem.value);
};
const handleFPSChange = function() {
  options.fps = fpsElem.value;
};

frameWidthElem.value = options.width;
frameHeightElem.value = options.height;
fpsElem.value = options.fps;

frameWidthElem.addEventListener('keyup', handleWidthChange);
frameWidthElem.addEventListener('change', handleWidthChange);

frameHeightElem.addEventListener('keyup', handleHeightChange);
frameHeightElem.addEventListener('change', handleHeightChange);

fpsElem.addEventListener('keyup', handleFPSChange);
fpsElem.addEventListener('change', handleFPSChange);

init();
