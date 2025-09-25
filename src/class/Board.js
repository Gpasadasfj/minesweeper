import RandomNumber from "../utils/RandomNumber";
import Cell from "./Cell";

export default class Board {
  constructor(size, mode) {
    this.size = size;
    this.mode = mode;
    this.mines = 0;
    this.flags = 0;
    this.cells = [];
    this.openCells = 0;
    this.isGameOver = false;
    this.onGameOver = null;
    this.isWinner = false;
    this.onCellReveal = null;
    this.deltas = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    this.createBoard();
  }

  // ----- Crear tablero -----
  createBoard() {
    this.createEmptyCells();
    this.createMines();
    this.placeMines();
    this.neighborMines();
  }

  createEmptyCells() {
    // Crear celdas vacías
    this.cells = [];
    for (let i = 0; i < this.size; i++) {
      let row = [];
      for (let e = 0; e < this.size; e++) {
        const cell = new Cell();
        row.push(cell);
      }
      this.cells.push(row);
    }
  }

  createMines() {
    // Calcular total de minas
    let nCells = this.size * this.size;
    switch (this.mode) {
      case "easy":
        this.mines = Math.round(nCells * 0.1);
        break;
      case "normal":
        this.mines = Math.round(nCells * 0.15);
        break;
      case "hard":
        this.mines = Math.round(nCells * 0.2);
        break;
    }
  }

  placeMines() {
    // Asignar minas a celdas aleatorias
    for (let i = 0; i < this.mines; i++) {
      let n1 = RandomNumber(this.size);
      let n2 = RandomNumber(this.size);
      if (this.cells[n1][n2].isMine) {
        i--;
        continue;
      }
      this.cells[n1][n2].setMine();
    }
  }

  neighborMines() {
    // Calcular minas adyacentes a cada celda
    this.cells.forEach((row, i) => {
      row.forEach((cell, e) => {
        let minesAround = 0;

        this.deltas.forEach(([dx, dy]) => {
          const x = i + dx;
          const y = e + dy;

          if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
            if (this.cells[x][y].isMine) {
              minesAround++;
            }
          }
        });
        cell.setNeighborMines(minesAround);
      });
    });
  }

  // ----- Lógica de juego -----
  revealCell(i, j) {
    // Revelar celda
    const cell = this.cells[i][j];

    // Si ya está revelada, salimos
    if (cell.isRevealed) return;

    cell.reveal();
    this.openCells++;

    // Avisar al UIManager para renderizar
    if (this.onCellReveal) this.onCellReveal(i, j);

    // Si es mina → game over
    if (cell.isMine) {
      this.isGameOver = true;
      if (this.onGameOver) this.onGameOver(); // Avisar a UIManager
      return;
    }

    if (cell.isFlagged) {
      this.flagSetter(i, j);
    }

    // Si no tiene minas alrededor → expandir
    if (cell.neighborMines === 0) {
      this.revealEmptyCells(i, j);
    }

    this.checkWinner();
  }

  revealEmptyCells(i, j) {
    // Revelar celdas vacías adyacentes de forma recursiva
    // Crear efecto visual al revelar celdas vacías
    setTimeout(() => {
      this.deltas.forEach(([dx, dy]) => {
        const x = i + dx;
        const y = j + dy;

        // Comprobar que la posición se encuentra dentro del tablero
        if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
          const neighbor = this.cells[x][y];

          // Si no esta revelada y no es mina la revelamos
          if (!neighbor.isRevealed && !neighbor.isMine) {
            // Si es bandera la controlamos
            if (neighbor.isFlagged) {
              this.flagSetter(x, y);
            }
            neighbor.reveal();
            this.openCells++;

            // Avisar al UIManager para renderizar
            if (this.onCellReveal) this.onCellReveal(x, y);

            // Llamar a la función de forma recursiva
            if (neighbor.neighborMines === 0) {
              this.revealEmptyCells(x, y);
            }
          }
        }
      });
    }, 10);
  }

  flagSetter(x, y) {
    // Colocar o eliminar banderas
    const cell = this.cells[x][y];
    cell.toggleFlag();
    cell.isFlagged ? (this.flags += 1) : (this.flags -= 1);
  }

  checkWinner() {
    // Comprobar si hay ganador
    if (this.openCells === this.size * this.size - this.mines) {
      this.isWinner = true;
    }
  }
}
