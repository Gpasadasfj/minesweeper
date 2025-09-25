export default function timeToSeconds(timeStr) {
  // Convertir el tiempo a segundos
  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}
