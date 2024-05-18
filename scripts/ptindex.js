let canvasData = [];
let timelapse = [];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const pixelSize = 10;
const canvasWidth = 35;
const canvasHeight = 35;

canvas.width = pixelSize * canvasWidth;
canvas.height = pixelSize * canvasHeight;


fetch('/place/starting')
	.then(response => response.json())
	.then(data => {
		canvasData.push(data); // {x, y, r, g, b} where x and y are 0-31 and r, g, b are between 0 and 255
		drawCanvas(canvasData);
	})
	.catch(error => {
		console.error('Error fetching canvas data:', error);
	});

fetch('/place/timelapse')
	.then(response => response.json())
	.then(data => {
		timelapse.push(data);
	})
	.catch(error => {
		console.error('Error fetching timelapse data:', error);
	});

function drawPixel(x, y, r, g, b, isLocal) {
	isLocal = isLocal || false;
	if (x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) return;
	if (!isLocal) return;
	else {
		ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
		ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
	}
}

function drawCanvas(canv) {
	if (!canv) return;

	for (let i = 0; i < canv[0].length; i++) {
		const { x, y, r, g, b } = canv[0][i];
		drawPixel(x, y, r, g, b, true);
	}
}

// Add border around the canvas
ctx.strokeStyle = 'black';
ctx.lineWidth = 2;
ctx.strokeRect(0, 0, canvas.width, canvas.height);

// buttons
const start = document.getElementById('start');
const pause = document.getElementById('pause');
const rewind = document.getElementById('rewind');
const faster = document.getElementById('faster');
const slower = document.getElementById('slower');

let isPlaying = false;
let speed = 18000; // fps
let frame = 0;



// Add a warning message to the console
for (let i = 0; i < 1000; i++) {
	console.warn('WARNING: Do not paste any code into the console! These can be super MALICIOUS!!!!');
}	