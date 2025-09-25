import defaultClick from "../sounds/defaultClick.wav";
import flagSound from "../sounds/flagSound.wav";
import mineSound from "../sounds/mineSound.mp3";
import victorySound from "../sounds/victorySound.mp3";

export default class SoundManager {
  constructor() {
    this.defaultAudio = new Audio(defaultClick);
    this.flagAudio = new Audio(flagSound);
    this.mineAudio = new Audio(mineSound);
    this.victoryAudio = new Audio(victorySound);
  }

  playDefault() {
    this.defaultAudio.load();
    this.defaultAudio.play();
  }
  playFlag() {
    this.flagAudio.load();
    this.flagAudio.play();
  }
  playMine() {
    this.mineAudio.load();
    this.mineAudio.play();
  }
  playVictory() {
    this.victoryAudio.load();
    this.victoryAudio.play();
  }
}
