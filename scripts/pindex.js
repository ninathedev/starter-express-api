let canvasData = [];
let isDrawingEnabled = true;

async function everything() {
	await fetch('/place/data')
		.then(response => response.json())
		.then(data => {
			canvasData.push(data); // {x, y, r, g, b} where x and y are 0-31 and r, g, b are between 0 and 255
		})
		.catch(error => {
			console.error('Error fetching canvas data:', error);
		});

	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	const pixelSize = 10;
	const canvasSize = 32;

	canvas.width = pixelSize * canvasSize;
	canvas.height = pixelSize * canvasSize;

	async function drawPixel(x, y, r, g, b, isPrepare) {
		isPrepare = isPrepare || false;
		if (x < 0 || y < 0 || x >= canvasSize || y >= canvasSize) return;
		ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
		ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

		if (!isPrepare) {
			await fetch('/place/draw', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					x: x,
					y: y,
					r: r,
					g: g,
					b: b
				}),
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

	async function drawCanvas() {
		if (!canvasData) return;

		for (let i = 0; i < canvasData.length; i++) {
			const { x, y, r, g, b } = canvasData[i];
			drawPixel(x, y, r, g, b, true);
		}
	}

	await drawCanvas();

	let selectedColor = '#FFFFFF';
	function setPaletteColors() {
		const paletteColors = ['#FFFFFF', '#E4E4E4', '#888888', '#222222', '#FFA7D1', '#E50000', '#E59500', '#A06A42', '#E5D900', '#94E044', '#02BE01', '#00D3DD', '#0083C7', '#0000EA', '#CF6EE4', '#820080'];

		const paletteContainer = document.createElement('div');
		paletteContainer.style.display = 'flex';
		document.body.appendChild(paletteContainer);

		for (let i = 0; i < paletteColors.length; i++) {
			const color = paletteColors[i];
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
	await setPaletteColors();

	// Add border around the canvas
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	canvas.addEventListener('click', async (event) => {
		if (!isDrawingEnabled) return;

		const rect = canvas.getBoundingClientRect();
		const x = Math.floor((event.clientX - rect.left) / pixelSize);
		const y = Math.floor((event.clientY - rect.top) / pixelSize);
		const [r, g, b] = hexToRgb(selectedColor);
		await drawPixel(x, y, r, g, b);

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
}

everything();