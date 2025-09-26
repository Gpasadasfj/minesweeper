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
    this.victoryAudio.preload = "auto";
    this.mineAudio.preload = "auto";
    this.flagAudio.preload = "auto";
    this.defaultAudio.preload = "auto";
  }

  playDefault() {
    this.defaultAudio.currentTime = 0
    this.defaultAudio.play();
  }
  playFlag() {
    this.flagAudio.currentTime = 0;
    this.flagAudio.play();
  }
  playMine() {
    this.mineAudio.currentTime = 0;
    this.mineAudio.play();
  }
  playVictory() {
    this.victoryAudio.currentTime = 0;
    this.victoryAudio.play();
  }
}
