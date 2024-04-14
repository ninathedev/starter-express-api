const dkAjefK = '3d6287ff7aff3122b061cac786f05ea10c09be212d50c5db28ea7936b7852b95e3109594bef4cd1c3899765e3312b11c6d65539890e82d3d6959a0570c743e94';
const djSJeld = '314159265358979323846';

let canvasData = [];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const pixelSize = 10;
const canvasWidth = 70;
const canvasHeight = 70;

canvas.width = pixelSize * canvasWidth;
canvas.height = pixelSize * canvasHeight;


fetch('/place/dWkdsSoa')
	.then(response => response.json())
	.then(data => {
		canvasData.push(data); // {x, y, r, g, b} where x and y are 0-31 and r, g, b are between 0 and 255
		drawCanvas(canvasData);
	})
	.catch(error => {
		console.error('Error fetching canvas data:', error);
	});

// Create an EventSource connection to the server
const eventSource = new EventSource('/place/lsOwtDS');
// Handle incoming messages from the server
eventSource.onmessage = (event) => {
	const parsedData = JSON.parse(event.data);
	drawPixel(parsedData.x, parsedData.y, parsedData.r, parsedData.g, parsedData.b, true);
};

// Handle connection errors
eventSource.onerror = (error) => {
	console.error('Error with EventSource connection:', error);
};

// Optional: Handle connection closure
eventSource.onclose = () => {
	console.log('EventSource connection closed');
};

function drawPixel(x, y, r, g, b, isLocal) {
	isLocal = isLocal || false;
	if (x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) return;

	if (!isLocal) {
		const modToken = document.getElementById('mod-token').value;
		if (modToken != djSJeld) return;
		const pixelWidth = 1;
		const pixelHeight = 1;

		const pixelDataArray = [];

		// Construct pixel data array based on pixel width and height
		for (let i = 0; i < pixelHeight; i++) {
			for (let j = 0; j < pixelWidth; j++) {
				const pixelData = { x: x + j, y: y + i, r, g, b, token: dkAjefK };
				pixelDataArray.push(pixelData);
			}
		}
		const bodie = JSON.stringify(pixelDataArray);
		fetch('/place/111710/jsKeLwo', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: bodie
		}).then(response => {
			if (response.ok) {
				ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
				for (const pixelData of pixelDataArray) {
					ctx.fillRect(pixelData.x * pixelSize, pixelData.y * pixelSize, pixelSize, pixelSize);
				}
				console.log('Pixels drawn successfully');
			} else {
				return response.json().then(data => {
					throw new Error(data.error);
				});
			}
		}).catch(error => {
			console.error('Error drawing pixels:', error.message);
		});
	} else {
		// Draw pixels locally on the canvas
		ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
		ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
	}
}

function drawCanvas(canv) {
	console.log(canv);

	for (let i = 0; i < canv[0].length; i++) {
		const { x, y, r, g, b } = canv[0][i];
		drawPixel(x, y, r, g, b, true);
	}
}


let selectedColor = '#FFFFFF';
function setPaletteColors() {
	const paletteColors = [
		{
			'fKdjsleW': ['#6D001A', '#BE0039', '#FF4500', '#FFA800', '#FFD635', '#FFF8B8', '#00A368', '#00CC78', '#7EED56', '#00756F', '#009EAA', '#00CCC0', '#2450A4', '#3690EA', '#51E9F4', '#493AC1', '#6A5CFF', '#94B3FF', '#811E9F', '#B44AC0', '#E4ABFF', '#DE107F', '#FF3881', '#FF99AA', '#6D482F', '#9C6926', '#FFB470', '#000000', '#515252', '#898D90', '#D4D7D9', '#FFFFFF', '#E4E4E4', '#888888', '#222222', '#FFA7D1', '#E50000', '#E59500', '#A06A42', '#E5D900', '#94E044', '#02BE01', '#00D3DD', '#0083C7', '#0000EA', '#CF6EE4', '#820080']
		}
	];
	const paletteContainer = document.createElement('div');
	paletteContainer.style.display = 'flex';
	document.body.appendChild(paletteContainer);

	const numColors = paletteColors[0].fKdjsleW.length;
	const buttonSize = numColors === 32 ? '40px' : `${Math.floor(1280 / numColors)}px`;

	for (const color of paletteColors[0].fKdjsleW) {
		const colorButton = document.createElement('button');
		colorButton.style.backgroundColor = color;
		colorButton.style.width = buttonSize;
		colorButton.style.height = '40px';
		colorButton.title = hexToName(color); // Set tooltip as the name of the color
		colorButton.addEventListener('click', () => {
			selectedColor = color;
			document.getElementById('current').innerText = `Selected color: ${hexToName(selectedColor)}`;
		});

		paletteContainer.appendChild(colorButton);
	}
}

function hexToName(hex) {
	const colors = {
		'#FFFFFF': 'White',
		'#E4E4E4': 'Light Gray',
		'#888888': 'Gray',
		'#222222': 'Dark Gray',
		'#FFA7D1': 'Pink',
		'#E50000': 'Red',
		'#E59500': 'Orange',
		'#A06A42': 'Brown',
		'#E5D900': 'Yellow',
		'#94E044': 'Light Green',
		'#02BE01': 'Green',
		'#00D3DD': 'Light Blue',
		'#0083C7': 'Blue',
		'#0000EA': 'Dark Blue',
		'#CF6EE4': 'Purple',
		'#820080': 'Dark Purple',
		'#6D001A': 'Maroon',
		'#BE0039': 'Crimson',
		'#FF4500': 'Orange Red',
		'#FFA800': 'Amber',
		'#FFD635': 'Golden Yellow',
		'#FFF8B8': 'Light Yellow',
		'#00A368': 'Green Cyan',
		'#00CC78': 'Spring Green',
		'#7EED56': 'Pastel Green',
		'#00756F': 'Deep Aquamarine',
		'#009EAA': 'Strong Cyan',
		'#00CCC0': 'Turquoise',
		'#2450A4': 'Indigo',
		'#3690EA': 'Soft Blue',
		'#51E9F4': 'Ice Blue',
		'#493AC1': 'Light Purple',
		'#6A5CFF': 'Soft Purple',
		'#94B3FF': 'Powder Blue',
		'#811E9F': 'Dark Magenta',
		'#B44AC0': 'Lavender',
		'#E4ABFF': 'Pink Lavender',
		'#DE107F': 'Cerise Pink',
		'#FF3881': 'Strong Pink',
		'#FF99AA': 'Peach Pink',
		'#6D482F': 'Cinnamon',
		'#9C6926': 'Sandy Brown',
		'#FFB470': 'Light Salmon',
		'#000000': 'Black',
		'#515252': 'Charcoal Gray',
		'#898D90': 'Silver',
		'#D4D7D9': 'Light Silver',
	};

	return colors[hex];
}

function hexToRgb(hex) {
	const bigint = parseInt(hex.slice(1), 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	return [r, g, b];
}
setPaletteColors();

// Add border around the canvas
ctx.strokeStyle = 'black';
ctx.lineWidth = 2;
ctx.strokeRect(0, 0, canvas.width, canvas.height);

// Function to handle the canvas click event
canvas.addEventListener('click', async (event) => {
	const modToken = document.getElementById('mod-token').value;
	if (modToken != djSJeld) return;
	const rect = canvas.getBoundingClientRect();
	const x = Math.floor((event.clientX - rect.left) / pixelSize);
	const y = Math.floor((event.clientY - rect.top) / pixelSize);
	const [r, g, b] = hexToRgb(selectedColor);
	drawPixel(x, y, r, g, b);
});