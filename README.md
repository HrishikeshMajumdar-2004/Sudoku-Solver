# Sudoku-Solver

I developed a web application for solving Sudoku puzzles using a backtracking algorithm. It retrieves a random Sudoku board from an online API. Users can attempt to solve the puzzle and verify if it's correct. The application includes a feature to automatically solve the puzzle using the backtracking algorithm.

API
Get
Board - returns a puzzle board

https://sugoku.onrender.com/board

Arguments -

Difficulty:
easy
medium
hard
random

Example:  https://sugoku.onrender.com/board?difficulty=easy

We randomly generate the query for the GET request from options such as easy, medium, hard, or random difficulty levels.
