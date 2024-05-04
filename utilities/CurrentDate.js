exports.getCurrentDateTimeIndia = function () {
  const ISTOffset = 330 * 60 * 1000; // UTC+5:30 in minutes
  const currentDate = new Date(Date.now() + ISTOffset);

  // Adjusting time by subtracting 5 hours and 30 minutes.
  const adjustedDate = new Date(currentDate.getTime() - (5 * 60 + 30) * 60000);

  // Extracting date components.
  const year = adjustedDate.getFullYear();
  const month = String(adjustedDate.getMonth() + 1).padStart(2, "0");
  const day = String(adjustedDate.getDate()).padStart(2, "0");

  // Extracting time components.
  let hours = adjustedDate.getHours();
  const minutes = String(adjustedDate.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12 for 12-hour clock

  // Constructing the formatted string.
  return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
};
