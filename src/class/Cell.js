export default class Cell {
  #isMine = false;
  #isRevealed = false;
  #isFlagged = false;
  #neighborMines = 0;

  constructor() {
    // La referencia al DOM la asignará el UIManager en renderBoard()
    this.element = null;
  }

  setMine() {
    // Colocar mina
    this.#isMine = true;
  }

  setNeighborMines(n) {
    // Asignar número de minas adyacentes
    this.#neighborMines = n;
  }

  reveal() {
    // Revelar minas
    if (this.#isFlagged || this.#isRevealed) return;
    this.#isRevealed = true;
  }

  toggleFlag() {
    // Colocar o eliminar bandera
    if (this.#isRevealed) return;
    this.#isFlagged = !this.#isFlagged;
    return this.#isFlagged;
  }

  // Getters
  get isMine() {
    return this.#isMine;
  }
  get isRevealed() {
    return this.#isRevealed;
  }
  get isFlagged() {
    return this.#isFlagged;
  }
  get neighborMines() {
    return this.#neighborMines;
  }
}
