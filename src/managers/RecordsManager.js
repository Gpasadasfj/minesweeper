import timeToSeconds from "../utils/TimeToSeconds";

export default class RecordsManager {
  constructor(timer) {
    this.timer = timer;
    this.timesDOMElement = document.querySelectorAll(".timeSpan");
  }

  setRecord(mode, size, time) {
    // Guardar récord
    const t = timeToSeconds(time);

    // Recorrer todos los elementos del DOM en los que se mostrará el
    //  récord actual
    this.timesDOMElement.forEach((e) => {
      if (e.dataset.mode === mode && Number(e.dataset.size) === size) {
        let actualTime = e.textContent;
        // Si no hay record guardado le asignamos infinito
        // Si lo hay se lo asignamos a actual time convirtiéndolo
        //  a segundos
        actualTime === "SIN TIEMPO"
          ? (actualTime = Infinity)
          : (actualTime = timeToSeconds(e.textContent));
        if (t < actualTime) {
          localStorage.setItem(`${mode}-${size}`, time);
          this.loadRecords(); // Si hay nuevo record, actualizamos
        }
      }
    });
  }

  loadRecords() {
    // Cargar los récords actuales
    this.timesDOMElement.forEach((e) => {
      for (let i = 0; i < localStorage.length; i++) {
        const [mode, size] = localStorage.key(i).split("-");
        if (e.dataset.mode === mode && e.dataset.size === size) {
          e.textContent = localStorage.getItem(`${mode}-${size}`);
        }
      }
    });
  }
}
