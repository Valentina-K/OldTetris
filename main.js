// 1. Додати інші фігури
// 2. Стилізувати нові фігури на свій погляд
// 3. Додати функцію рандому котра буде видавати випадкову фігуру
// 4. Ценрування фігури коли вона з'являється
// 5. Додати функцію ранромних кольорів для кожної нової фігури

const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const START_POSITION = (size) => parseInt((PLAYFIELD_COLUMNS - size) / 2);

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
let scores = 0;
let timerId = null;
let speed = 1;

generatePlayfield();
generateTetromino();
const cells = document.querySelectorAll(".tetris div");
const newGameBtn = document.querySelector("[data-new-button]");
const modal_window = document.querySelector("[data-madal]");
const scoresElem = document.querySelector(".scores");
const currentScoresEl = document.querySelector(".currentScores > span");
const radios = document.querySelectorAll(".input-radio");
radios.forEach((elem) => elem.addEventListener("change", onChanged));
drawTetromino();
document.addEventListener("keydown", onKeyDown);
newGameBtn.addEventListener("click", newGameClick);
timerId = setInterval(() => {
  moveTetrominoDown();
  draw();
}, 1000 / speed);

function onChanged(ev) {
  console.dir(ev.target);
  speed = parseInt(ev.target.value);
  ev.target.blur();
  clearInterval(timerId);
  timerId = setInterval(() => {
    moveTetrominoDown();
    draw();
  }, 1000 / speed);
}

function newGameClick() {
  toggleModal();
  scores = 0;

  playfield = new Array(PLAYFIELD_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
  generateTetromino();
  timerId = setInterval(() => {
    moveTetrominoDown();
    draw();
  }, 1000 / speed);
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
  tetromino = Object.create(TETROMINOES[getRandomInt(TETROMINO_NAMES.length)]);
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
  const name = tetromino.name;
  const tetrominoMatrixSize = tetromino.matrix.length;
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (tetromino.matrix[row][column] == 0) {
        continue;
      }
      if (tetromino.row + row < 0) {
        continue;
      }
      const cellIndex = convertPositionToIndex(
        tetromino.row + row,
        tetromino.column + column
      );
      cells[cellIndex].classList.add(name);
    }
  }
}
/* у всех cells удаляется атрибут class и добавляется новый класс из playfield и tetromino*/
function draw() {
  cells.forEach(function (cell) {
    cell.removeAttribute("class");
  });
  if (endOfGameCheck()) {
    clearInterval(timerId);
    scoresElem.textContent = `Your scores is ${scores}`;
    toggleModal();
  }
  drawPlayField();
  drawTetromino();
}

function onKeyDown(event) {
  switch (event.key) {
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
  }
  draw();
}

function moveTetrominoDown() {
  tetromino.row += 1;
  if (isOutsideOfGameBoard()) {
    tetromino.row -= 1;
    placeTetromino();
  }
}
function moveTetrominoLeft() {
  tetromino.column -= 1;
  if (isOutsideOfGameBoard()) {
    tetromino.column += 1;
  }
}
function moveTetrominoRight() {
  tetromino.column += 1;
  if (isOutsideOfGameBoard()) {
    tetromino.column -= 1;
  }
}

function isOutsideOfGameBoard() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (!tetromino.matrix[row][column]) {
        continue;
      }
      if (
        tetromino.column + column < 0 ||
        tetromino.column + column >= PLAYFIELD_COLUMNS ||
        tetromino.row + row >= playfield.length ||
        playfield[tetromino.row + row]?.[tetromino.column + column]
      ) {
        return true;
      }
    }
  }
  return false;
}

function placeTetromino() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (!tetromino.matrix[row][column]) continue; //если в ячейке стоит 0
      playfield[tetromino.row + row][tetromino.column + column] =
        tetromino.name;
    }
  }
  const filledRows = findFilledRows();
  removeFillRows(filledRows);
  generateTetromino();
}

function endOfGameCheck() {
  return playfield[0].some((el) => el != 0);
}

function rotateTetromino() {
  const oldMatrix = tetromino.matrix;
  const rotatedMatrix = rotateMatrix(tetromino.matrix);
  tetromino.matrix = isOutsideOfGameBoard() ? oldMatrix : rotatedMatrix;
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
  currentScoresEl.innerHTML = `${scores}`;
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
