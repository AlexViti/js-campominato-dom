// HTML elements catchers
const gridContainer = document.querySelector('.grid-container');
const btnPlay = document.getElementById('btn-play');
const difficultySelect = document.getElementById('difficulty-select');
const body = document.querySelector('body');
const styleElement = document.querySelector('style');

// Play start events
btnPlay.addEventListener ('click', playSetUp); 
difficultySelect.addEventListener ('change', playSetUp);

// Game setup
function playSetUp() {

	// if (youLooseElement != undefined) {
	// 	body.removeChild(youLooseElement);
	// }

	let youLooseFlag = false;

	// Remove the previous grid every time you press play
	gridContainer.innerHTML = '';

	// Get the difficulty value from the select and set the grid sizes (which coincidentally is a square)
	const difficulty = parseInt(difficultySelect.value);

	const cellSize = `calc(var(--grid-size) / ${difficulty})`;

	// Create matrix with the cell elements
	const gridMatrix = [];

	/* 
	Grid generator with 2 chained for loops, the outer one for
	rows, the inner one for columns
	*/

	for (let i = 0; i < difficulty; i++) {
		const row = document.createElement('div');
		row.classList.add('d-flex');

		// Arrays that will populate gridMatrix
		const cellArr = [];

		for (let j = 1; j <= difficulty; j++) {
			const cell = document.createElement('div');
			cell.className = 'd-inline-block text-center cell';
			cell.innerText = j + i * difficulty;
			cell.style = `
				width: ${cellSize};
				height: ${cellSize}; 
				line-height: ${cellSize};
			`;

			cell.addEventListener('click', cellSelector);

			cellArr.push(cell);
			row.append(cell);
		}
		cellArr[0].style.borderLeft = `var(--cell-border)`;
		gridMatrix.push(cellArr);
		gridMatrix[0][i].style.borderTop = `var(--cell-border)`;
		gridContainer.append(row);
	}

	const numberOfMine = 16;
	const minePosition = mineCreator(numberOfMine, difficulty);
	
	for (let i = 0; i < minePosition.length; i++) {
		gridMatrix[minePosition[i][0]][minePosition[i][1]].classList.add('mine');
	}

	/*
	Cell select class toggler when pressed
	*/

	function cellSelector() {
		if (this.classList.contains('mine')) {
			youLoose();
		} else if(!youLooseFlag) {
			this.classList.add('cell-selected');
			console.log(youLooseFlag);
		}
	}
	
	function youLoose() {
		styleElement.innerHTML = `
			.mine {
				background-color: red;
			}
		`;
		youLooseFlag = true;
	}
}

// let youLooseElement;

// function youLoose() {
// 	youLooseElement = document.createElement('div');
// 	youLooseElement.classList.add('loose');
// 	youLooseElement.style = `
// 		position: absolute;
// 		display: block;
// 		height: 60vh;
// 		line-height: 60vh;
// 		text-align: center;
// 		left: 0;
// 		right: 0;
// 		top: 50%;
// 		transform: translate(0, -50%);
// 		background :white;
// 		color: red
// 	`;
// 	youLooseElement.innerText = 'Hai Perso';
// 	body.append(youLooseElement);
// }


function randomInteger(min, max) {
	const randomNumber = Math.floor(Math.random() * max + min);
	return randomNumber;
}

function mineCreator(numberOfMine, gridSize) {
	const minePosition = [];
	const minePositionStrings = [];
	while (minePosition.length < numberOfMine) {
		const rowIndex = randomInteger(0, gridSize);
		const columnIndex = randomInteger(0, gridSize);
		if (!minePositionStrings.includes(`${rowIndex}, ${columnIndex}`)) {
			minePositionStrings.push(`${rowIndex}, ${columnIndex}`);
			minePosition.push([rowIndex, columnIndex])
		}
	}
	return minePosition;
}