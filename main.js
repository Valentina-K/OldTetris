// 1. Додати інші фігури
// 2. Стилізувати нові фігури на свій погляд
// 3. Додати функцію рандому котра буде видавати випадкову фігуру
// 4. Ценрування фігури коли вона з'являється
// 5. Додати функцію ранромних кольорів для кожної нової фігури

const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const START_POSITION = (size) => parseInt((PLAYFIELD_COLUMNS - size) / 2);

const TETROMINO_NAMES = ["O", "L", "J", "S", "Z", "T", "I", "P", "R", "X", "C"];
const TETROMINOES = [
  {
    name: "O",
    matrix: [
      [1, 1],
      [1, 1],
    ],
    row: 0,
    column: START_POSITION(2),
    rotate: 0,
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
    rotate: 3,
  },
  {
    name: "J",
    matrix: [
      [0, 0, 1],
      [0, 0, 1],
      [0, 1, 1],
    ],
    row: 0,
    column: 3,
    rotate: START_POSITION(3),
  },
  {
    name: "S",
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    row: 0,
    column: START_POSITION(3),
    rotate: 1,
  },
  {
    name: "Z",
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    row: 0,
    column: START_POSITION(3),
    rotate: 1,
  },
  {
    name: "T",
    matrix: [
      [1, 1],
      [1, 0],
    ],
    row: 0,
    column: START_POSITION(2),
    rotate: 2,
  },
  {
    name: "I",
    matrix: [
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    row: 0,
    column: START_POSITION(4),
    rotate: 1,
  },
  {
    name: "P",
    matrix: [
      [1, 1],
      [0, 0],
    ],
    row: 0,
    column: START_POSITION(2),
    rotate: 1,
  },
  {
    name: "R",
    matrix: [
      [1, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
    ],
    row: 0,
    column: START_POSITION(3),
    rotate: 1,
  },
  {
    name: "X",
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    row: 0,
    column: START_POSITION(3),
    rotate: 1,
  },
  {
    name: "C",
    matrix: [[1]],
    row: 0,
    column: START_POSITION(1),
    rotate: 0,
  },
];

let playfield;
let tetromino;
let isGameOut = false;

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
/* создается массив playfield и наполняется 0*/
function generatePlayfield() {
  const playfieldcells = PLAYFIELD_ROWS * PLAYFIELD_COLUMNS;
  const coutn_cells = playfieldcells + PLAYFIELD_COLUMNS * 4;
  for (let i = 0; i < coutn_cells; i++) {
    const div = document.createElement("div");
    if (i >= playfieldcells) div.className = "tetris-footer";
    document.querySelector(".tetris").append(div);
  }

  playfield = new Array(PLAYFIELD_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
}

function generateTetromino() {
  tetromino = Object.create(TETROMINOES[getRandomInt(10)]);
  console.dir(tetromino);
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
    if (cell.className !== "tetris-footer") cell.removeAttribute("class");
  });
  drawPlayField();
  drawTetromino();
}

function onKeyDown(event) {
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
  console.log(cells);
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
        playfield[tetromino.row + row][tetromino.column + column] !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}

function placeTetromino() {
  console.log("object");
  console.log(tetromino);
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (!tetromino.matrix[row][column]) continue; //если в ячейке стоит 0
      console.log(playfield);
      playfield[tetromino.row + row][tetromino.column + column] =
        tetromino.name;
    }
  }
  generateTetromino();
}

function endOfGameCheck() {
  return playfield[0].some((el) => el != 0);
}
