const spawnRate = 0.02;
const dragRate = 0.8;

function randomElement(array) {
	return array[Math.floor(Math.random() * array.length)];
}

let world = { width: 40, height: 30 };
world.grid = new Array(world.width * world.height).fill("empty");

world.scheme = {
	empty: "white",
	actor: "lightblue",
	obstacle: "gray",
};

world.cross = function(index) {
	let neighbors = [];
	if (index >= this.width)
		neighbors.push(index - this.width);
	if (index % this.width > 0)
		neighbors.push(index - 1);
	if (index % this.width < this.width - 1)
		neighbors.push(index + 1);
	if (index / this.width < this.height - 1)
		neighbors.push(index + this.width);
	return neighbors;
};

world.adjacent = function(index) {
	let neighbors = [];
	let x = index % this.width, y = Math.floor(index / this.width);
	for (let j = y - 1; j <= y + 1; j++) {
		for (let i = x - 1; i <= x + 1; i++) {
			if (i >= 0 && i < this.width &&
				j >= 0 && j < this.height &&
				!(i == x && j == y))
				neighbors.push(i + j * this.width);
		}
	}
	return neighbors;
};

world.createTable = function() {
	let table = document.createElement("table");
	table.style.margin = "30px auto";
	for (let y = 0; y < this.height; y++) {
		let tr = document.createElement("tr");
		for (let x = 0; x < this.width; x++) {
			let td = document.createElement("td");
			td.style.width = "10px";
			td.style.height = "10px";
			td.style.border = "1px solid #ccc";
			td.style.color = "#444";
			td.style.font = "10px monospace";
			td.style.textAlign = "center";
			//td.textContent = x + y * this.width;;
			let cell = this.grid[x + y * this.width];
			if (this.scheme[cell])
				td.style.backgroundColor = this.scheme[cell];
			td.onclick = event => {
				if (this.grid[x + y * this.width] == "obstacle")
					this.grid[x + y * this.width] = "empty";
				else if (this.grid[x + y * this.width] == "empty")
					this.grid[x + y * this.width] = "obstacle";
			};
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	return table;
}

world.updateTable = function(table) {
	let tds = table.querySelectorAll("td");
	for (let i = 0; i < tds.length; i++) {
		let cell = this.grid[i];
		if (this.scheme[cell])
			tds[i].style.backgroundColor = this.scheme[cell];
	}
	return table;
}

let table = world.createTable();
document.body.appendChild(table);
(function frame() {
	requestAnimationFrame(frame);
	world.updateTable(table);
})();

let birthday = [41,45,48,49,50,53,54,55,56,59,60,61,62,65,69,81,85,87,91,93,97,99,103,106,108,121,122,123,124,125,127,128,129,130,131,133,134,135,136,139,140,141,142,147,161,165,167,171,173,179,187,201,205,207,211,213,219,227,327,328,329,330,334,335,336,339,340,341,342,345,346,347,348,349,351,355,367,371,375,379,383,387,391,395,407,408,409,410,415,419,420,421,422,427,431,432,433,434,435,447,451,455,459,463,467,471,475,487,488,489,490,494,495,496,499,503,507,511,515,619,620,621,622,626,627,628,631,635,638,659,663,665,669,672,674,678,694,695,696,699,703,705,706,707,708,709,713,718,739,743,745,749,753,779,780,781,782,785,789,793,798];

for (let obstacle of birthday)
	world.grid[obstacle] = "obstacle";

function populate() {
	for (let i = 0; i < world.grid.length; i++) {
		if (world.grid[i] == "empty" && Math.random() < spawnRate) {
			world.grid[i] = "actor";
		}
	}
}

function step() {
	let actors = [];
	for (let i = 0; i < world.grid.length; i++)
		if (world.grid[i] == "actor") actors.push(i);
	for (let actor of actors) {
		let neighbors = world.cross(actor);
		let emptys = neighbors.filter(neighbor => world.grid[neighbor] == "empty");
		let obstacles = neighbors.filter(neighbor => world.grid[neighbor] == "obstacle");
		if (emptys.length) {
			let empty = randomElement(emptys);
			world.grid[empty] = "actor";
			if (obstacles.length > 0 && Math.random() < dragRate) {
				let obstacle = randomElement(obstacles);
				world.grid[obstacle] = "empty";
				world.grid[actor] = "obstacle";
			}
			else
				world.grid[actor] = "empty";
		}
	}
}

let button = document.createElement("button");
button.style.display = "block";
button.style.margin = "10px auto";
button.style.padding = "10px";
button.style.border = "1px solid dodgerblue";
button.style.backgroundColor = "white";
button.style.color = "dodgerblue";
button.style.font = "16px monospace";
button.textContent = "POPULATE";
button.addEventListener("click", event => {
	switch(button.textContent) {
		case "POPULATE":
			populate();
			button.textContent = "RUN";
			break;
		case "RUN":
			setInterval(step, 100);
			button.textContent = "HAPPY BIRTHDAY";
			button.disabled = true;
			break;
		default:
			break;
	}
});
document.body.appendChild(button);
