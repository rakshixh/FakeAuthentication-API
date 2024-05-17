function getCurrentDateTime() {
  const date = new Date(); // Date object
  const currentDate = date.toISOString().slice(0, 10); // Current date
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const currentTime =
    formattedHours +
    ":" +
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds +
    " " +
    ampm; // Current time with AM or PM
  return currentDate + " " + currentTime;
}

module.exports = {
  getCurrentDateTime,
};
