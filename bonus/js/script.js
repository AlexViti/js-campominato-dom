// HTML elements catchers
const main = document.querySelector('main');
const gridContainer = document.querySelector('.grid-container');
const btnPlay = document.getElementById('btn-play');
const difficultySelect = document.querySelector('select[name="difficulty"]');
const rowsNumberEle = document.querySelector('input[name="rows"]');
const columnsNumberEle = document.querySelector('input[name="columns"]');
const styleElement = document.querySelector('style');

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

function randomInt(min, max) {
	const randomNumber = Math.floor(Math.random() * max + min);
	return randomNumber;
}

function Cell(index, columns, element) {
	this.row = Math.floor(index / columns);
	this.column = index - this.row * columns;
	this.mine = false;
	this.minesNear = 0;
	this.element = element;
}

function cellsGenerator(cellsNumber, columnNumber) {
	const cellsArr = []
	for (let i = 0; i < cellsNumber; i++) {
		const cell = new Cell(i, columnNumber, cellEleCreator(columnNumber));
		cellsArr.push(cell);
	}
	return cellsArr;
}

function gridGenerator(rows, columns, cellsArr) {
	const cellsMatrix = [];
	let index = 0;
	for (let i = 0; i < rows; i++) {
		const cellsRow = [];

		const row = document.createElement('div');
		row.classList.add('d-flex');

		for (let j = 0; j < columns; j++) {
			row.append(cellsArr[index].element);
			cellsRow.push(cellsArr[index]);
			index++;
		}
		gridContainer.append(row);
		cellsMatrix.push(cellsRow);
	}

	for (let i = 0; i < columns; i++) {
		cellsMatrix[0][i].element.style.borderTop = `var(--cell-border)`;
	}

	for (let i = 0; i < rows; i++) {
		cellsMatrix[i][0].element.style.borderLeft = `var(--cell-border)`;
	}

	return cellsMatrix;
}

function cellEleCreator(columns) {
	const cellSize = `calc(var(--grid-size) / ${columns})`;
	const cellEle = document.createElement('div');
	cellEle.className = 'd-inline-block text-center cell';
	cellEle.style = `
		width: ${cellSize};
		height: ${cellSize}; 
		line-height: ${cellSize};
	`;
	return cellEle;
}

function mineCreator(minesNumber, cellsNumber) {
	const minesPosition = [];
	while (minesPosition.length < minesNumber) {
		const randomNumber = randomInt(0, cellsNumber);
		if (!minesPosition.includes(randomNumber)) {
			minesPosition.push(randomNumber);
		}
	}
	return minesPosition;
}

function mineAssigner(cellsArr, minesPosition) {
	const minesArr = [];

	for (let i = 0; i < minesPosition.length; i++) {
		cellsArr[minesPosition[i]].mine = true;
		cellsArr[minesPosition[i]].element.classList.add('mine');
		minesArr.push(cellsArr[minesPosition[i]]);
	}
	return minesArr;
}

function minesNear(minesArr, cellsMatrix) {
	for (let i = 0; i < minesArr.length; i++) {
		const row = minesArr[i].row;
		const rowMax = cellsMatrix.length - 1;
		const column = minesArr[i].column;
		const columnMax = cellsMatrix[0].length - 1;
		if (row != 0 && column != 0) {
			cellsMatrix[row - 1][column - 1].minesNear++;
		}
		if (row != 0) {
			cellsMatrix[row - 1][column].minesNear++;	
		}
		if (row != 0 && column < columnMax) {
			cellsMatrix[row - 1][column + 1].minesNear++;
		}
		if (column != 0) {
			cellsMatrix[row][column - 1].minesNear++;
		}
		if (column < columnMax) {
			cellsMatrix[row][column + 1].minesNear++;
		}
		if (row < rowMax && column != 0) {
			cellsMatrix[row + 1][column - 1].minesNear++;
		}
		if (row < rowMax) {
			cellsMatrix[row + 1][column].minesNear++;
		}
		if (row < rowMax && column < columnMax) {
			cellsMatrix[row + 1][column + 1].minesNear++;
		}
	}
}

btnPlay.addEventListener ('click', playSetUp);
difficultySelect.addEventListener ('change', playSetUp);

function playSetUp() {
	gridContainer.innerHTML = '';
	const columns = parseInt(columnsNumberEle.value);
	const rows = parseInt(rowsNumberEle.value);
	const cellsNumber = rows * columns;
	const minesNumber = parseInt(difficultySelect.value);
	
	const cellsArr = cellsGenerator(cellsNumber, columns);
	const minesPosition = mineCreator(minesNumber, cellsNumber);
	const minesArr = mineAssigner(cellsArr, minesPosition);
	const gridMatrix = gridGenerator(rows, columns, cellsArr);
	minesNear(minesArr, gridMatrix);

	for (let i = 0; i < cellsArr.length; i++) {
		const minesNear = cellsArr[i].minesNear;
		const mine = cellsArr[i].mine;
		cellsArr[i].element.addEventListener('click', function() {
			if (mine) {
				youLoose();
			} else {
				this.classList.add('cell-selected');
				this.innerHTML = minesNear;
			}
		});
	}
}

function youLoose() {
	styleElement.innerHTML = `
		.mine {
			background-color: red;
		}
	`;
	endFlag = true;
	resultMessage.innerHTML = `
		<span style="font-size: 30px; color: red;">Hai perso!</span>
	`;
	resultMessage.style.display = 'block';
}
/*

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

	/*

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

	/*

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
*/