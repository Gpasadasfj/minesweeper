import "./style.css";
import Timer from "./class/Timer";
import SoundManager from "./managers/SoundManager";
import UIManager from "./managers/UIManager";
import RecordsManager from "./managers/RecordsManager";

function initApp() {
  const timer = new Timer();
  const sound = new SoundManager();
  const records = new RecordsManager();

  const ui = new UIManager(timer, sound, records);
}

initApp();
