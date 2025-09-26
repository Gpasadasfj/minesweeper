 // ----- Comprobar tipo de dispositivo -----
export default function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}