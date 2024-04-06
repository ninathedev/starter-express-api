let canvasData = [];
let isDrawingEnabled = true;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const pixelSize = 10;
const canvasSize = 32;

canvas.width = pixelSize * canvasSize;
canvas.height = pixelSize * canvasSize;


fetch('/place/data')
	.then(response => response.json())
	.then(data => {
		canvasData.push(data); // {x, y, r, g, b} where x and y are 0-31 and r, g, b are between 0 and 255
		drawCanvas(canvasData);
	})
	.catch(error => {
		console.error('Error fetching canvas data:', error);
	});

	

function drawPixel(x, y, r, g, b, isPrepare) {
	isPrepare = isPrepare || false;
	if (x < 0 || y < 0 || x >= canvasSize || y >= canvasSize) return;
	ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
	ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
	if (!isPrepare) {
		const bodie = JSON.stringify({ x, y, r, g, b });
		fetch('/place/draw', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: bodie
		})
			.then(response => {
				if (response.ok) {
					console.log('Pixel drawn successfully');
				} else {
					return response.json().then(data => {
						throw new Error(data.error);
					});
				}
			})
			.catch(error => {
				console.error('Error drawing pixel:', error.message);
			});
	}
}

function drawCanvas(canv) {
	if (!canv) return;

	for (let i = 0; i < canv[0].length; i++) {
		const { x, y, r, g, b } = canv[0][i];
		drawPixel(x, y, r, g, b, true);
	}
}


let selectedColor = '#FFFFFF';
function setPaletteColors() {
	const paletteColors = [];
	fetch('/place/palette', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		}
	}).then(response => response.json())
		.then(data => {
			paletteColors.push(data);
		}).catch(error => {
			console.error('Error fetching canvas data:', error);
		});
	setTimeout(() => {
		const paletteContainer = document.createElement('div');
		paletteContainer.style.display = 'flex';
		document.body.appendChild(paletteContainer);

		for (const color of paletteColors[0].colors) {
			const colorButton = document.createElement('button');
			colorButton.style.backgroundColor = color;
			colorButton.style.width = '40px';
			colorButton.style.height = '40px';
			colorButton.addEventListener('click', () => {
				selectedColor = color;
				document.getElementById('current').innerText = `Selected color: ${hexToName(selectedColor)}`;
			});

			paletteContainer.appendChild(colorButton);
		}
	}, 1000);
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

canvas.addEventListener('click',  (event) => {
	if (!isDrawingEnabled) return;

	const rect = canvas.getBoundingClientRect();
	const x = Math.floor((event.clientX - rect.left) / pixelSize);
	const y = Math.floor((event.clientY - rect.top) / pixelSize);
	const [r, g, b] = hexToRgb(selectedColor);
	drawPixel(x, y, r, g, b);

	isDrawingEnabled = false;
	let timer = 60; // 60 seconds

	const timerText = document.getElementById('timer');
	timerText.innerText = `Drawing disabled (${timer} seconds)`;

	const countdown = setInterval(() => {
		timer--;
		timerText.innerText = `Drawing disabled (${timer} seconds)`;

		if (timer === 0) {
			clearInterval(countdown);
			isDrawingEnabled = true;
			timerText.innerText = 'Drawing enabled';
		}
	}, 1000); // 1 second interval
});