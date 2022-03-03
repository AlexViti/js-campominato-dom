// HTML elements catchers
const gridContainer = document.querySelector('.grid-container');
const btnPlay = document.getElementById('btn-play');
const difficultySelect = document.getElementById('difficulty-select');
const main = document.querySelector('main');
const styleElement = document.querySelector('style');


// Play start events
btnPlay.addEventListener ('click', playSetUp); 
difficultySelect.addEventListener ('change', playSetUp);

let resultMessage = document.createElement('div');
resultMessage.style = `
	position: absolute;
	display: none;
	top: 0;
	left: 0;
	right: 0;
	font-size: 20px;
	background-color: white;
	padding: 1rem 0;
	text-align: center;
`;
main.append(resultMessage);

// Game setup
function playSetUp() {

	styleElement.innerHTML = '';
	resultMessage.style.display = 'none';
	let endFlag = false;
	let goodMoveCounter = 0;

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
	const minesPosition = mineCreator(numberOfMine, difficulty);
	
	for (let i = 0; i < minesPosition.length; i++) {
		gridMatrix[minesPosition[i][0]][minesPosition[i][1]].classList.add('mine');
	}

	/*
	Cell select class toggler when pressed
	*/

	function cellSelector() {
		if (this.classList.contains('mine')) {
			youLoose();
		} else if(!endFlag) {
			if (!this.classList.contains('cell-selected')) {
				this.classList.add('cell-selected');
				goodMoveCounter++;
			}
		}
		if (goodMoveCounter == difficulty * difficulty - numberOfMine) {
			youWon();
		}
	}

	function youWon() {
		endFlag = true;
		resultMessage.innerHTML = `
			<span style="font-size: 30px; color: green;">Hai Vinto!</span> Il tuo punteggio è di ${goodMoveCounter}
		`;
		resultMessage.style.display = 'block';
	}

	function youLoose() {
		styleElement.innerHTML = `
			.mine {
				background-color: red;
			}
		`;
		endFlag = true;
		resultMessage.innerHTML = `
			<span style="font-size: 30px; color: red;">Hai perso!</span> Il tuo punteggio è di ${goodMoveCounter}
		`;
		resultMessage.style.display = 'block';
	}
}

function randomInteger(min, max) {
	const randomNumber = Math.floor(Math.random() * max + min);
	return randomNumber;
}

function mineCreator(numberOfMine, gridSize) {
	const minesPosition = [];
	const minesPositionStrings = [];
	while (minesPosition.length < numberOfMine) {
		const rowIndex = randomInteger(0, gridSize);
		const columnIndex = randomInteger(0, gridSize);
		if (!minesPositionStrings.includes(`${rowIndex}, ${columnIndex}`)) {
			minesPositionStrings.push(`${rowIndex}, ${columnIndex}`);
			minesPosition.push([rowIndex, columnIndex])
		}
	}
	return minesPosition;
}