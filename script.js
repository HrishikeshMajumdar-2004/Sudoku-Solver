// Define a 9x9 array 'arr' to hold input elements
var arr = [[], [], [], [], [], [], [], [], []];

// Initialize 'arr' with input elements from the DOM
for (var i = 0; i < 9; i++) {
  for (var j = 0; j < 9; j++) {
    arr[i][j] = document.getElementById(i * 9 + j);
  }
}

// Initialize 'initialBoard' and 'board', 9x9 arrays to store Sudoku board values
var initialBoard = [[], [], [], [], [], [], [], [], []];
var board = [[], [], [], [], [], [], [], [], []];

// Function to fill the UI input fields with initial Sudoku board values
function FillBoard(initialBoard) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (initialBoard[i][j] !== 0) {
        arr[i][j].value = initialBoard[i][j];
      } else {
        arr[i][j].value = "";
      }
      board[i][j] = initialBoard[i][j]; // Initialize board with initial values
    }
  }
}

// Event listener for input changes in UI
const inputs = document.querySelectorAll("input");
inputs.forEach((input) => {
  input.addEventListener("input", updateValue);
});

// Update 'board' values when input changes
function updateValue(e) {
  let val = e.target.value;
  let id = parseInt(e.target.id);
  let i = Math.floor(id / 9);
  let j = id % 9;

  if (val === "") {
    arr[i][j].value = ""; // Reset UI input field
    board[i][j] = 0; // Reset board value
  } else {
    arr[i][j].value = val; // Update UI input field
    board[i][j] = parseInt(val); // Update board value
  }
}

// Button event to fetch Sudoku puzzle from API based on difficulty
// Event handler for the 'Get Puzzle' button click
GetPuzzle.onclick = function () {
  // Define possible difficulty levels for Sudoku puzzles
  const difficulties = ["easy", "medium", "hard"];

  // Randomly select a difficulty level from the 'difficulties' array
  const randomDifficulty =
    difficulties[Math.floor(Math.random() * difficulties.length)];

  // Create a new XMLHttpRequest object to make an HTTP request
  var xhrRequest = new XMLHttpRequest();

  // Define the onload function that executes when the request completes successfully
  xhrRequest.onload = function () {
    // Parse the response data from JSON format to JavaScript object
    var response = JSON.parse(xhrRequest.response);

    // Update the 'initialBoard' array with the Sudoku board received from the API response
    initialBoard = response.board;

    // Reset 'board' to match 'initialBoard'
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        board[i][j] = initialBoard[i][j];
      }
    }

    // Populate the UI with the new Sudoku board using the 'FillBoard' function
    FillBoard(initialBoard);
  };

  // Set up the HTTP GET request to fetch a Sudoku board from an API based on selected difficulty
  xhrRequest.open(
    "get",
    `https://sugoku.onrender.com/board?difficulty=${randomDifficulty}`
  );

  // Send the HTTP request
  xhrRequest.send();
};

// Button event to solve the current Sudoku puzzle
SolvePuzzle.onclick = () => {
  if (SudokuSolver(initialBoard, 9)) {
    FillBoard(initialBoard);
  }
};

// Function to find the next empty cell on the Sudoku board
function findEmptyLocation(board, obj, n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === 0) {
        obj.row = i;
        obj.col = j;
        return true;
      }
    }
  }
  return false;
}

// Functions to check if a number can be placed in a specific row, column, or grid
function isSafeInRow(board, n, row, val) {
  for (let i = 0; i < n; i++) {
    if (board[row][i] === val) {
      return false;
    }
  }
  return true;
}

function isSafeInCol(board, n, col, val) {
  for (let i = 0; i < n; i++) {
    if (board[i][col] === val) {
      return false;
    }
  }
  return true;
}

function isSafeInGrid(board, n, row, col, val) {
  let rowStart = row - (row % 3);
  let colStart = col - (col % 3);
  for (let i = rowStart; i < rowStart + 3; i++) {
    for (let j = colStart; j < colStart + 3; j++) {
      if (board[i][j] === val) {
        return false;
      }
    }
  }
  return true;
}

// Function to check if placing a number at a specific position is safe
function isSafe(board, n, row, col, val) {
  return (
    isSafeInRow(board, n, row, val) &&
    isSafeInCol(board, n, col, val) &&
    isSafeInGrid(board, n, row, col, val)
  );
}

// Function to display a success message when Sudoku is solved
function showPositiveAlert() {
  var alertDiv = document.createElement("div");
  alertDiv.classList.add("alert", "alert-success", "custom-alert");

  var alertHeading = document.createElement("h4");
  alertHeading.classList.add("alert-heading");
  alertHeading.textContent = "Well done!";
  alertDiv.appendChild(alertHeading);

  var alertContent = document.createElement("div");
  alertContent.innerHTML = `
    <p>Congratulations! You've successfully solved the Sudoku puzzle.</p>
    <p>Well done on your logical thinking and persistence. Enjoy the satisfaction of mastering this challenge!</p>
    <hr>
  `;
  alertDiv.appendChild(alertContent);

  document.body.prepend(alertDiv);

  setTimeout(function () {
    alertDiv.remove();
  }, 5000);
}

// Function to display a failure message when Sudoku is not solved
function showNegativeAlert() {
  var alertDiv = document.createElement("div");
  alertDiv.classList.add("alert", "alert-danger", "custom-alert");

  var alertHeading = document.createElement("h4");
  alertHeading.classList.add("alert-heading");
  alertHeading.textContent = "Well done!";
  alertDiv.appendChild(alertHeading);

  var alertContent = document.createElement("div");
  alertContent.innerHTML = `
    <p>Don't give up! Every challenge brings you closer to success. Take a moment, rethink your strategy, and give it another shot. You're making progress with every attempt!</p>
    <hr>
  `;
  alertDiv.appendChild(alertContent);

  document.body.prepend(alertDiv);

  setTimeout(function () {
    alertDiv.remove();
  }, 5000);
}

// Button event to check if Sudoku puzzle is solved correctly
CheckPuzzle.onclick = function () {
  let n = 9;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === 0) {
        showNegativeAlert();
        return false;
      }
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let num = board[i][j];
      board[i][j] = 0;
      if (!isSafe(board, n, i, j, num)) {
        board[i][j] = num;
        showNegativeAlert();
        return false;
      }
      board[i][j] = num;
    }
  }

  showPositiveAlert();
  return true;
};

// Function to recursively solve Sudoku using backtracking
function SudokuSolver(board, n) {
  let obj = {
    row: -1,
    col: -1,
  };

  if (!findEmptyLocation(board, obj, n)) {
    return true;
  }

  let { row, col } = obj;

  for (let num = 1; num <= n; num++) {
    if (isSafe(board, n, row, col, num)) {
      board[row][col] = num;
      if (SudokuSolver(board, n)) {
        return true;
      }
      board[row][col] = 0;
    }
  }
  return false;
}
