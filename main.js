// 1. Додати інші фігури
// 2. Стилізувати нові фігури на свій погляд
// 3. Додати функцію рандому котра буде видавати випадкову фігуру
// 4. Ценрування фігури коли вона з'являється
// 5. Додати функцію ранромних кольорів для кожної нової фігури

const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;

const TETROMINO_NAMES = ["O", "L", "J", "S", "Z", "T", "I", "P", "R", "X", "C"];
const TETROMINOES = [
  {
    name: "O",
    matrix: [
      [1, 1],
      [1, 1],
    ],
    row: 2,
    column: 2,
  },
  {
    name: "L",
    matrix: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    row: 3,
    column: 3,
  },
  {
    name: "J",
    matrix: [
      [0, 0, 1],
      [0, 0, 1],
      [0, 1, 1],
    ],
    row: 3,
    column: 3,
  },
  {
    name: "S",
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    row: 3,
    column: 3,
  },
  {
    name: "Z",
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    row: 3,
    column: 3,
  },
  {
    name: "T",
    matrix: [
      [1, 1],
      [1, 0],
    ],
    row: 2,
    column: 2,
  },
  {
    name: "I",
    matrix: [
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    row: 4,
    column: 4,
  },
  {
    name: "P",
    matrix: [
      [1, 1],
      [0, 0],
    ],
    row: 2,
    column: 2,
  },
  {
    name: "R",
    matrix: [
      [1, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
    ],
    row: 3,
    column: 3,
  },
  {
    name: "X",
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    row: 3,
    column: 3,
  },
  {
    name: "C",
    matrix: [[1]],
    row: 1,
    column: 1,
  },
];

let playfield;
let tetromino;

generatePlayfield();
generateTetromino();
const cells = document.querySelectorAll(".tetris div");
drawTetromino();
document.addEventListener("keydown", onKeyDown);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function convertPositionToIndex(row, column) {
  return row * PLAYFIELD_COLUMNS + column;
}

function generatePlayfield() {
  for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
    const div = document.createElement("div");
    document.querySelector(".tetris").append(div);
  }

  playfield = new Array(PLAYFIELD_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
  console.log(playfield);
}
function generateTetromino() {
  console.log("from generateTetromino");
  //const nameTetro = TETROMINO_NAMES[getRandomInt(10)];
  tetromino = TETROMINOES[getRandomInt(10)];
  console.log(tetromino);
}

function drawPlayField() {
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
      // if(playfield[row][column] == 0) { continue };
      const name = playfield[row][column];
      const cellIndex = convertPositionToIndex(row, column);
      cells[cellIndex].classList.add(name);
    }
  }
}

function drawTetromino() {
  const name = tetromino.name;
  const tetrominoMatrixSize = tetromino.matrix.length;

  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (tetromino.matrix[row][column] == 0) {
        continue;
      }

      const cellIndex = convertPositionToIndex(
        tetromino.row + row,
        tetromino.column + column
      );
      cells[cellIndex].classList.add(name);
    }
  }
  console.log("from drawTetromino");
}

function draw() {
  cells.forEach(function (cell) {
    cell.removeAttribute("class");
  });
  drawPlayField();
  drawTetromino();
  console.log("from draw");
}

function onKeyDown(event) {
  console.log(event);
  switch (event.key) {
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
  console.log("from moveTetrominoDown");
}
function moveTetrominoLeft() {
  tetromino.column -= 1;
  if (isOutsideOfGameBoard()) {
    tetromino.column += 1;
  }
  console.log("from moveTetrominoLeft");
}
function moveTetrominoRight() {
  tetromino.column += 1;
  if (isOutsideOfGameBoard()) {
    tetromino.column -= 1;
  }
  console.log("from moveTetrominoRight");
}

function isOutsideOfGameBoard() {
  console.log("from isOutsideOfGameBoard");
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (!tetromino.matrix[row][column]) {
        continue;
      }
      if (
        tetromino.column + column < 0 ||
        tetromino.column + column >= PLAYFIELD_COLUMNS ||
        tetromino.row + row >= playfield.length
      ) {
        return true;
      }
    }
  }
  return false;
}

function placeTetromino() {
  console.log("from placeTetromino");
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (!tetromino.matrix[row][column]) continue;

      playfield[tetromino.row + row][tetromino.column + column] =
        TETROMINO_NAMES[0];
    }
  }
  generateTetromino();
}
