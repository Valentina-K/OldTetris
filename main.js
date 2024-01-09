const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const START_POSITION = (size) => parseInt((PLAYFIELD_COLUMNS - size) / 2);
const STORAGE_RESULT = localStorage.getItem("result")
  ? localStorage.getItem("result")
  : 0;

const TETROMINO_NAMES = [
  "O",
  "L",
  "J",
  "S",
  "Z",
  "T",
  "I",
  "P",
  "R",
  "X",
  "C",
  "N",
];
const TETROMINOES = [
  {
    name: "O",
    matrix: [
      [1, 1],
      [1, 1],
    ],
    row: 0,
    column: START_POSITION(2),
  },
  {
    name: "L",
    matrix: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    row: 0,
    column: START_POSITION(3),
  },
  {
    name: "J",
    matrix: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    row: -2,
    column: START_POSITION(3),
  },
  {
    name: "S",
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    row: -2,
    column: START_POSITION(3),
  },
  {
    name: "Z",
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    row: -2,
    column: START_POSITION(3),
  },
  {
    name: "T",
    matrix: [
      [1, 1],
      [1, 0],
    ],
    row: -2,
    column: START_POSITION(2),
  },
  {
    name: "I",
    matrix: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    row: -2,
    column: START_POSITION(4),
  },
  {
    name: "P",
    matrix: [
      [1, 1],
      [0, 0],
    ],
    row: -2,
    column: START_POSITION(2),
  },
  {
    name: "R",
    matrix: [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    row: -2,
    column: START_POSITION(3),
  },
  {
    name: "X",
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    row: -2,
    column: START_POSITION(3),
  },
  {
    name: "C",
    matrix: [[1]],
    row: 0,
    column: START_POSITION(1),
  },
  {
    name: "N",
    matrix: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ],
    row: -2,
    column: START_POSITION(3),
  },
];

let playfield;
let tetromino;
let currentTetromino;
let nextTetromino;
let scores = 0;
let lines = 0;
let timerId = null;
let speed = 1;
let isPause = false;
let best_result =
  parseInt(STORAGE_RESULT) > scores ? parseInt(STORAGE_RESULT) : scores;
document.querySelector(".best-result > span").innerHTML = best_result;
generatePlayfield();
currentTetromino = generateTetromino();
nextTetromino = generateTetromino();
const cells = document.querySelectorAll(".tetris div");
const newGameBtn = document.querySelector("[data-new-button]"); //new game
const modal_window = document.querySelector("[data-madal]");
const speedRadio = document.querySelector(".speed");
const navigationBtn = document.querySelector(".navigation");
const restartBtn = document.querySelector(".restart-btn");

speedRadio.addEventListener("click", onChanged);
navigationBtn.addEventListener("click", onBtnDown);

drawTetromino();
drawTetrominoNext();
document.addEventListener("keydown", onKeyDown);
newGameBtn.addEventListener("click", newGameClick);
restartBtn.addEventListener("click", onRestart);
startTimer();

function onRestart() {
  initGame();
}

function onChanged(ev) {
  speed = parseInt(ev.target.value);
  ev.target.blur();
  clearInterval(timerId);
  startTimer();
}

function initGame() {
  scores = 0;
  lines = 0;
  document.querySelector(".currentScores > span").innerHTML = `${scores}`;
  document.querySelector(".deleteLines > span").innerHTML = `${lines}`;
  playfield = new Array(PLAYFIELD_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
  currentTetromino = generateTetromino();
  nextTetromino = generateTetromino();
  drawTetrominoNext();
  startTimer();
}

function startTimer() {
  timerId = setInterval(() => {
    moveTetrominoDown();
    draw();
  }, 1000 / speed);
}

function newGameClick() {
  toggleModal();
  best_result = parseInt(STORAGE_RESULT) > scores ? STORAGE_RESULT : scores;
  localStorage.setItem("result", JSON.stringify(best_result));
  document.querySelector(".best-result > span").innerHTML = best_result;

  initGame();
}

function toggleModal() {
  modal_window.classList.toggle("is-hidden");
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function convertPositionToIndex(row, column) {
  return row * PLAYFIELD_COLUMNS + column;
}
/* создается массив playfield и наполняется 0*/
function generatePlayfield() {
  const playfieldcells = PLAYFIELD_ROWS * PLAYFIELD_COLUMNS;
  for (let i = 0; i < playfieldcells; i++) {
    const div = document.createElement("div");
    document.querySelector(".tetris").append(div);
  }

  playfield = new Array(PLAYFIELD_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
}

function generateTetromino() {
  return Object.create(TETROMINOES[getRandomInt(TETROMINO_NAMES.length)]);
  /* tetromino = Object.create(TETROMINOES[getRandomInt(TETROMINO_NAMES.length)]);
  drawTetrominoNext(); */
}
/* в массиве cells добавляем имя класса '0' в каждую ячейку*/
function drawPlayField() {
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
      const name = playfield[row][column];
      const cellIndex = convertPositionToIndex(row, column);
      cells[cellIndex].classList.add(name);
    }
  }
}
/* В массиве cells добавляем имя класса tetromino, там где в matrix стоит 1 */
function drawTetromino() {
  const name = currentTetromino.name;
  const tetrominoMatrixSize = currentTetromino.matrix.length;
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (currentTetromino.matrix[row][column] == 0) {
        continue;
      }
      if (currentTetromino.row + row < 0) {
        return; //continue;
      }
      const cellIndex = convertPositionToIndex(
        currentTetromino.row + row,
        currentTetromino.column + column
      );
      cells[cellIndex].classList.add(name);
    }
  }
}

function drawTetrominoNext() {
  const name = nextTetromino.name;
  const tetrominoMatrixSize = nextTetromino.matrix.length;
  const nextArray = document.querySelectorAll(".next div");
  nextArray.forEach(function (cell) {
    cell.removeAttribute("class");
  });
  let delta = 0;
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (nextTetromino.matrix[row][column] == 0) {
        continue;
      }
      const cellIndex = row * tetrominoMatrixSize + column + delta;
      nextArray[cellIndex].classList.add(name);
      nextArray[cellIndex].classList.add("figure");
    }
    delta = 4 - tetrominoMatrixSize;
  }
}
/* у всех cells удаляется атрибут class и добавляется новый класс из playfield и tetromino*/
function draw() {
  cells.forEach(function (cell) {
    cell.removeAttribute("class");
  });
  /* if (endOfGameCheck()) {
    clearInterval(timerId);
    document.querySelector(
      ".modal-scores"
    ).innerHTML = `Your scores is ${scores}`;
    toggleModal();
  } */
  drawPlayField();
  drawTetromino();
}

function onBtnDown(event) {
  switch (event.target.id) {
    case "rotate":
      rotateTetromino();
      break;
    case "down":
      moveTetrominoDown();
      break;
    case "left":
      moveTetrominoLeft();
      break;
    case "right":
      moveTetrominoRight();
      break;
    case "pause":
      pauseTetromino();
      break;
    case "bottom":
      bottomTetromino();
      break;
  }
  draw();
}

function onKeyDown(event) {
  switch (event.code) {
    case "ArrowUp":
      rotateTetromino();
      break;
    case "ArrowDown":
      moveTetrominoDown();
      break;
    case "ArrowLeft":
      moveTetrominoLeft();
      break;
    case "ArrowRight":
      moveTetrominoRight();
      break;
    case "Space":
      pauseTetromino();
      break;
    case "Enter":
      bottomTetromino();
      break;
  }
  draw();
}

function pauseTetromino() {
  isPause = !isPause;
  if (isPause) clearInterval(timerId);
  else startTimer();
}

function bottomTetromino() {
  while (!isOutsideOfGameBoard()) {
    currentTetromino.row += 1;
  }
  if (isOutsideOfGameBoard()) {
    currentTetromino.row -= 1;
    placeTetromino();
    nextTetromino = generateTetromino();
    drawTetrominoNext();
  }
}

function moveTetrominoDown() {
  currentTetromino.row += 1;
  if (isOutsideOfGameBoard()) {
    currentTetromino.row -= 1;
    placeTetromino();
    nextTetromino = generateTetromino();
    drawTetrominoNext();
  }
}
function moveTetrominoLeft() {
  currentTetromino.column -= 1;
  if (isOutsideOfGameBoard()) {
    currentTetromino.column += 1;
  }
}
function moveTetrominoRight() {
  currentTetromino.column += 1;
  if (isOutsideOfGameBoard()) {
    currentTetromino.column -= 1;
  }
}

function isOutsideOfGameBoard() {
  const matrixSize = currentTetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (!currentTetromino.matrix[row][column]) {
        continue;
      }
      if (
        currentTetromino.column + column < 0 ||
        currentTetromino.column + column >= PLAYFIELD_COLUMNS ||
        currentTetromino.row + row >= playfield.length ||
        playfield[currentTetromino.row + row]?.[
          currentTetromino.column + column
        ]
      ) {
        return true;
      }
    }
  }
  return false;
}

function isOutsideTopBoard(row) {
  return currentTetromino.row + row < 0;
}

function placeTetromino() {
  const matrixSize = currentTetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (!currentTetromino.matrix[row][column]) continue; //если в ячейке стоит 0
      if (isOutsideTopBoard(row)) {
        clearInterval(timerId);
        document.querySelector(
          ".modal-scores"
        ).innerHTML = `Your scores is ${scores}`;
        toggleModal();
        return;
      }
      playfield[currentTetromino.row + row][currentTetromino.column + column] =
        currentTetromino.name;
    }
  }
  const filledRows = findFilledRows();
  removeFillRows(filledRows);
  currentTetromino = Object.create(nextTetromino);
}

function endOfGameCheck() {
  return playfield[0].some((el) => el !== 0);
}

function rotateTetromino() {
  const oldMatrix = currentTetromino.matrix;
  const rotatedMatrix = rotateMatrix(currentTetromino.matrix);
  currentTetromino.matrix = rotatedMatrix;
  if (isOutsideOfGameBoard()) currentTetromino.matrix = oldMatrix;
}

function rotateMatrix(matrixTetromino) {
  const N = matrixTetromino.length;
  const rotateMatrix = [];
  for (let i = 0; i < N; i++) {
    rotateMatrix[i] = [];
    for (let j = 0; j < N; j++) {
      rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
    }
  }
  return rotateMatrix;
}

function removeFillRows(filledRows) {
  filledRows.forEach((row) => {
    dropRowsAbove(row);
  });
  lines += filledRows.length;
  document.querySelector(".deleteLines > span").innerHTML = `${lines}`;
  document.querySelector(".currentScores > span").innerHTML = `${scores}`;
}

function dropRowsAbove(rowDelete) {
  for (let row = rowDelete; row > 0; row--) {
    playfield[row] = playfield[row - 1];
  }

  playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}

function findFilledRows() {
  const filledRows = [];

  playfield.forEach((row, index) => {
    if (row.every((cell) => cell !== 0)) filledRows.push(index);
  });
  scores +=
    filledRows.length > 1 ? filledRows.length * 20 : filledRows.length * 10;
  return filledRows;
}
