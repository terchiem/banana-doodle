const URL = 'https://banana-get.herokuapp.com/';

const getButton = document.getElementById('get-button');
const loading = document.getElementById('loading');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.strokeStyle = '#42331c';
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 6;

let bananas = [];

// Draw a line from a set of coordinates
function drawPath(stroke) {
  const [x, y] = stroke;
  ctx.beginPath();
  ctx.moveTo(x[0], y[0]);

  for (let i = 1; i < x.length; i++) {
    ctx.lineTo(x[i], y[i]);
  }

  ctx.stroke();
}

// Draw all lines of a drawing
function drawBanana(drawing) {
  for (let stroke of drawing) {
    drawPath(stroke);
  }
}

// Clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Get 50 drawings from API
async function getBananas() {
  const resp = await axios.get(URL);
  return resp.data.drawings;
}

// Display load while getting bananas
async function loadBananas() {
  try {
    startLoad();
    bananas = await getBananas();
    endLoad();
  } catch (e) {
    displayError();
  }
}

// Get banana button
async function handleClick(e) {
  clearCanvas();
  const drawing = bananas.pop();
  drawBanana(drawing);
  if (bananas.length <= 0) {
    await loadBananas();
  }
}

// Display loading message and hide canvas
function startLoad() {
  loading.style.display = 'block';
  canvas.style.display = 'none';
  getButton.disabled = true;
}

// Hide loading message and display canvas
function endLoad() {
  loading.style.display = 'none';
  canvas.style.display = 'block';
  getButton.disabled = false;
}

// Display error message on server error
function displayError() {
  const error = document.getElementById('error');
  error.style.display = 'block';
  loading.style.display = 'none';
  canvas.style.display = 'none';
  getButton.disabled = true;
}

async function setUp() {
  await loadBananas();
}

window.addEventListener('load', () => {
  setUp();
  getButton.addEventListener('click', handleClick)
});