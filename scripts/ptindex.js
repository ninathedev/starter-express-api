/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */

let canvasData = [];
let timelapse = [];

const pixelSize = 10;
const canvasWidth = 70;
const canvasHeight = 70;

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
		console.log(timelapse);
	})
	.catch(error => {
		console.error('Error fetching timelapse data:', error);
	});

function setup() {
	createCanvas(canvasWidth * pixelSize, canvasHeight * pixelSize);
	background(255);
}

function drawPixel(x, y, r, g, b, isLocal) {
	isLocal = isLocal || false;
	if (x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) return;
	if (!isLocal) return;
	else {
		
	}
}

function drawCanvas(canv) {
	if (!canv) return;

	for (let i = 0; i < canv[0].length; i++) {
		const { x, y, r, g, b } = canv[0][i];
		drawPixel(x, y, r, g, b, true);
	}
}

// buttons
const start = document.getElementById('start');
const pause = document.getElementById('pause');
const rewind = document.getElementById('rewind');
const faster = document.getElementById('faster');
const slower = document.getElementById('slower');

let isPlaying = false;
let speed = 10; // minutes in real time to seconds in animation
let frame = 0;

function draw() {
	if (isPlaying) {
		if (frame % speed === 0) {
			
		}
		frame++;
	}
}

// Add a warning message to the console
for (let i = 0; i < 1000; i++) {
	console.warn('WARNING: Do not paste any code into the console! These can be super MALICIOUS!!!!');
}	