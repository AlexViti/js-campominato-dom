// HTML elements catchers
const main = document.querySelector('main');
const gridContainer = document.querySelector('.grid-container');
const btnPlay = document.getElementById('btn-play');
const difficultySelect = document.querySelector('select[name="difficulty"]');
const rowsNumberEle = document.querySelector('input[name="rows"]');
const columnsNumberEle = document.querySelector('input[name="columns"]');
const styleElement = document.querySelector('style');
let firstGame = true;

let resultMessage = document.createElement('div');
resultMessage.style = `
	position: absolute;
	display: block;
	top: 0;
	left: 0;
	right: 0;
	font-size: 20px;
	background-color: white;
	padding: 1rem 0;
	text-align: center;
`;

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

// Mines managment
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
	// Reset
	if (!firstGame) {
		main.removeChild(resultMessage);
	}
	firstGame = false;
	let endFlag = false;
	gridContainer.innerHTML = '';
	let score = 0;
	styleElement.innerHTML = '';
	
	// Variables from inputs
	const columns = parseInt(columnsNumberEle.value);
	const rows = parseInt(rowsNumberEle.value);
	const cellsNumber = rows * columns;
	const minesNumber = parseInt(difficultySelect.value);
	
	// Cells and mines generation
	const cellsArr = cellsGenerator(cellsNumber, columns);
	const minesPosition = mineCreator(minesNumber, cellsNumber);
	const minesArr = mineAssigner(cellsArr, minesPosition);
	const gridMatrix = gridGenerator(rows, columns, cellsArr);
	minesNear(minesArr, gridMatrix);
	
	// Cell click events
	for (let i = 0; i < cellsArr.length; i++) {
		const minesNear = cellsArr[i].minesNear;
		const mine = cellsArr[i].mine;
		cellsArr[i].element.addEventListener('click', function() {
			if (mine) {
				endFlag = youLoose(score);
			} else if (!endFlag) {
				if (!this.classList.contains('cell-selected')){
					score++;
					this.classList.add('cell-selected');
					this.innerHTML = minesNear;
				}
			} 
			if (score == cellsNumber - minesNumber) {
				endFlag = youWon(score);
			}
		});
	}
}

// End game
function youWon(score) {
	resultMessage.innerHTML = `
	<span style="font-size: 30px; color: green;">Hai Vinto!</span> Il tuo punteggio è di ${score}
	`;
	main.append(resultMessage);
	return true;
}

function youLoose(score) {
	styleElement.innerHTML = `
	.mine {
		background-color: red;
	}
	`;
	resultMessage.innerHTML = `
	<span style="font-size: 30px; color: red;">Hai perso!</span> Il tuo punteggio è di: ${score}
	`;
	main.append(resultMessage);
	return true;
}

// Math functions
function randomInt(min, max) {
	const randomNumber = Math.floor(Math.random() * max + min);
	return randomNumber;
}