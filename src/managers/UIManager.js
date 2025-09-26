import Board from "../class/Board";
import isMobile from "../utils/CheckDevice";

export default class UIManager {
  constructor(timer, sound, records) {
    this.timer = timer;
    this.sound = sound;
    this.board = null;
    this.records = records;

    // Elementos del DOM
    this.boardContainer = document.querySelector("#board");
    this.sizeButtons = document.querySelectorAll(".size");
    this.modeButtons = document.querySelectorAll(".mode");
    this.flagsCounter = document.querySelector("#nFlagsPlaced");
    this.minesCounter = document.querySelector("#nAllMines");

    // Inicializar listeners
    this.setupMenu();

    // Cargar records
    this.records.loadRecords();

    // Comprobar dispositivo
    this.useMobileEvents = isMobile();
  }

  // ----- Inicialización de botones -----
  setupMenu() {
    const sizes = [8, 16, 24];
    const modes = ["easy", "normal", "hard"];

    this.sizeButtons.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        this.selectSize(sizes[i]);
        this.handleActiveBtn(this.sizeButtons, btn);
      });
    });

    this.modeButtons.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        this.selectMode(modes[i]);
        this.handleActiveBtn(this.modeButtons, btn);
      });
    });
  }

  handleActiveBtn(btns, btn) {
    btns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }

  // ----- Setters de tablero -----
  selectSize(size) {
    this.selectedSize = size;
    this.tryStartGame();
  }

  selectMode(mode) {
    this.selectedMode = mode;
    this.tryStartGame();
  }

  tryStartGame() {
    if (this.selectedSize && this.selectedMode) {
      this.startGame(this.selectedSize, this.selectedMode);
    }
  }

  // ----- Renderizar tablero -----
  startGame(size, mode) {
    // Creamos un nuevo Board cada vez que cambia config
    this.board = new Board(size, mode);

    // Asignamos callback para renderizar cada celda
    this.board.onCellReveal = (i, j) => {
      this.renderCell(i, j);
    };

    // Asignar callback para gestionar la derrota
    this.board.onGameOver = () => this.handleGameOver();

    this.renderBoard(this.boardContainer);
    this.timer.resetTimer();
    this.timer.startTimer();
  }

  renderBoard(container) {
    // Crear tablero y celdas y añadirles EventListener
    container.innerHTML = "";
    const table = document.createElement("table");
    table.id = "table";

    const boardWrapper = document.querySelector("#board-wrapper");

    for (let i = 0; i < this.board.size; i++) {
      const row = document.createElement("tr");

      for (let j = 0; j < this.board.size; j++) {
        const cellEl = document.createElement("td");
        this.board.cells[i][j].element = cellEl;

        if (this.useMobileEvents) {
          // Activar eventos de móvil
          this.mobileEventsHandler(cellEl, i, j);
        } else {
          // Activar eventos en PC
          this.PCEventsHandler(cellEl, i, j);
        }

        row.appendChild(cellEl);
      }
      table.appendChild(row);
    }

    container.appendChild(table);
    boardWrapper.className = "board-wrapper";
  }

  // ----- Eventos del tablero -----
  PCEventsHandler(element, i, j) {
    // Eventos de PC
    element.addEventListener("click", (event) => {
      this.handleCellClick(i, j); // click izquierdo revela
    });

    element.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      this.handleFlagClick(event, i, j); // click derecho bandera
    });
  }

  mobileEventsHandler(element, i, j) {
    // Eventos de móvil
    let pressTimer = null;
    let longPress = false;

    element.addEventListener("pointerdown", (e) => {
      longPress = false;
      pressTimer = setTimeout(() => {
        longPress = true;
        this.handleFlagClick(e, i, j); // poner bandera
      }, 250);
    });

    element.addEventListener("pointerup", (e) => {
      clearTimeout(pressTimer);
      if (longPress) {
        // Si fue long press no revelar
        e.preventDefault();
        return;
      }

      this.handleCellClick(i, j);
    });

    element.addEventListener("pointercancel", () => clearTimeout(pressTimer));
  }

  renderCell(i, j) {
    // Dependiendo del estado de la celda le asignamos un valor de texto
    const cell = this.board.cells[i][j];
    const el = cell.element;

    if (!el) return;

    if (cell.isMine) {
      el.classList.add("mine");
      el.textContent = "💣";
      return;
    }
    if (cell.isRevealed && cell.neighborMines === 0) {
      cell.element.style.backgroundColor = "white";
      el.classList.add("revealed");
    }
    if (cell.neighborMines > 0) {
      el.textContent = cell.neighborMines;
      el.classList.add(`num-${cell.neighborMines}`);
    } else {
      el.textContent = "";
    }
  }

  // ----- Manejo de clicks -----
  handleCellClick(i, j) {
    // Click izquierdo
    const cell = this.board.cells[i][j];
    if (this.board.isGameOver || this.board.checkWinner() || cell.isRevealed)
      return;

    this.board.revealCell(i, j);

    this.updateCounters();

    if (!cell.isMine) {
      this.sound.playDefault();
    }

    // Verificar victoria
    if (this.board.checkWinner()) {
      this.board.checkWinner(); // bloquea más clicks
      this.handleVictory();
    }
  }

  handleFlagClick(e, i, j) {
    // Click derecho
    e.preventDefault();
    const cell = this.board.cells[i][j];
    if (this.board.isGameOver || this.board.checkWinner() || cell.isRevealed)
      return;

    this.sound.playFlag();
    if (cell.isRevealed) return;

    // Añadir clase para dar estilos
    cell.element.classList.toggle(".flagged");

    if (cell.element.textContent === "🚩") {
      cell.element.textContent = "";
      this.board.flagSetter(i, j);
    } else {
      cell.element.textContent = "🚩";
      this.board.flagSetter(i, j);
    }

    this.updateCounters();
  }

  // ----- Contadores -----
  updateCounters() {
    this.flagsCounter.textContent = this.board.flags;
    this.minesCounter.textContent = this.board.mines;
  }

  // ----- Fin de juego -----
  handleGameOver() {
    this.timer.pauseTimer();
    this.showMessage("¡Fin del Juego!");
    this.sound.playMine();

    // Revelar todas las minas en UI
    this.board.cells.flat().forEach((cell) => {
      if (cell.isMine) cell.element.textContent = "💣";
    });
  }

  handleVictory() {
    this.timer.pauseTimer();
    this.showMessage("¡Has ganado!");
    this.sound.playVictory();
    // Guardar record
    this.records.setRecord(
      this.selectedMode,
      this.selectedSize,
      this.timer.getTime()
    );
  }

  // ----- Mensajes -----
  showMessage(text) {
    const msg = document.createElement("div");
    msg.className = "game-over-message";
    msg.textContent = text;
    document.body.appendChild(msg);

    setTimeout(() => {
      document.body.removeChild(msg);
    }, 5000);
  }
}
