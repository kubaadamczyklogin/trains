export function addingMinutes(modifiedTime, addedMinutes) {
  const hourEndMinutes = modifiedTime.split(":");
  const minutes = addedMinutes * 1000 * 60;
  let time = new Date();
  time = time.setHours(hourEndMinutes[0], hourEndMinutes[1]) + minutes;
  time = new Date(time);

  const newHours = time.getHours();
  let newMinutes = time.getMinutes();

  newMinutes = newMinutes > 9 ? newMinutes : "0" + newMinutes;

  return newHours + ":" + newMinutes;
}

export function millisecondsToTime(milliseconds) {
  const negative = milliseconds < 0;

  milliseconds = Math.abs(milliseconds);

  const hours = Math.floor(milliseconds / (60 * 60 * 1000));
  let minuts = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
  minuts = minuts > 9 ? minuts : "0" + minuts;

  return (negative ? "-" : "") + hours + ":" + minuts;
}
