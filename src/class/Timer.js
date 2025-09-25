export default class Timer {
  constructor() {
    this.s = 0;
    this.m = 0;
    this.h = 0;
    this.timerElement = document.querySelector(".timer");
    this.intervalId = null;
  }

  getTime() {
    // Obtener tiempo actual
    return this.timerElement.textContent;
  }

  addTime = () => {
    // Lógica del temporizador
    this.s += 1;
    if (this.s === 60) {
      this.s = 0;
      this.m += 1;
      if (this.m === 60) {
        this.m = 0;
        this.h += 1;
      }
    }

    // Asignar el valor al elemento del DOM en formato 00:00:00
    this.timerElement.textContent = `${this.formatNum(this.h)}:${this.formatNum(
      this.m
    )}:${this.formatNum(this.s)}`;
  };

  startTimer() {
    // Inicializar temporizador
    if (!this.intervalId) {
      this.intervalId = setInterval(this.addTime, 1000);
    }
  }

  pauseTimer() {
    // Pausar temporizador
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  resetTimer() {
    // Reiniciar temporizador
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.h = 0;
    this.m = 0;
    this.s = 0;
    this.timerElement.textContent = `${this.formatNum(this.h)}:${this.formatNum(
      this.m
    )}:${this.formatNum(this.s)}`;
  }

  formatNum(num) {
    // Formato 00
    return num.toString().padStart(2, "0");
  }
}
