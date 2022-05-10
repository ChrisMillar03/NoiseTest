/* Adapted from https://github.com/joeiddon/perlin */
class NoiseLib
{
	constructor()
	{
		this.memory = {};
		this.grid = {};
	}

	randomUnitVector()
	{
		let a = Math.random() * 2 * Math.PI;

		return { x: Math.sin(a), y: Math.cos(a) };
	}

	smoothStep(x)
	{
		return (6 * x ** 5) - (15 * x ** 4) + (10 * x ** 3);
	}

	interpolate(x, a, b)
	{
		return a + this.smoothStep(x) * (b - a);
	}

	dotProductGrid(x, y, vx, vy)
	{
		let gVector;
		let dVector = { x: x - vx, y: y - vy };

		if (this.grid[[vx, vy]])
		{
			gVector = this.grid[[vx, vy]];
		}
		else
		{
			gVector = this.randomUnitVector();
			this.grid[[vx, vy]] = gVector;
		}

		return dVector.x * gVector.x + dVector.y * gVector.y;
	}

	get(x, y)
	{
		if (this.memory.hasOwnProperty([x, y])) return this.memory[[x, y]];

		let xf = Math.floor(x);
		let yf = Math.floor(y);

		let t1 = this.dotProductGrid(x, y, xf, yf);
		let t2 = this.dotProductGrid(x, y, xf + 1, yf);
		let b1 = this.dotProductGrid(x, y, xf, yf + 1);
		let b2 = this.dotProductGrid(x, y, xf + 1, yf + 1);

		let xt = this.interpolate(x - xf, t1, t2);
		let xb = this.interpolate(x - xf, b1, b2);
		let v = this.interpolate(y - yf, xt, xb);

		this.memory[[x, y]] = v;

		return v;
	}
}

window.onload = () =>
{
	let c = document.getElementById('view');
	let ctx = c.getContext('2d');
	let noise = new NoiseLib();

	let n = 16;
	let player = { x: 0, y: 0, step: 1 };

	window.addEventListener('keydown', (e) =>
	{
		switch (e.key)
		{
			case 'a':
			case 'ArrowLeft':
				player.x -= player.step;
				break;

			case 'd':
			case 'ArrowRight':
				player.x += player.step;
				break;

			case 'w':
			case 'ArrowUp':
				player.y -= player.step;
				break;

			case 's':
			case 'ArrowDown':
				player.y += player.step;
				break;
		}
	}, false);

	setInterval(() =>
	{
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, c.width, c.height);

		for (let i = 0; i < c.width / n; i++)
		{
			for (let j = 0; j < c.height / n; j++)
			{
				let val = noise.get((player.x + i) / 16, (player.y + j) / 16);

				ctx.fillStyle = val > 0.1 ? '#fff' : '#000';
				ctx.fillRect(n * i, n * j, n, n);
			}
		}

		let val = noise.get(Math.floor((c.width - n) / n / 2 + player.x) / 16, Math.floor(c.height / n / 2 + player.y) / 16);

		ctx.fillStyle = val > 0.1 ? '#f00' : '#0f0';
		ctx.fillRect(c.width / 2 - n, c.height / 2 - n / 2, n, n);
	}, 1000 / 50);
}
