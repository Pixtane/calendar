// X for html (xml)
let Xdate = document.querySelector(".date");
let XscrollerMonth = document.querySelector(".scrollerMonth");
let XcalendarGrid = document.querySelector(".calendarGrid");

/**
 * Add 0 on the start of single digit numbers
 * @param {number} n to format
 * @returns {string} formatted number (as string)
 **/
function n(n) {
  return n > 9 ? "" + n : "0" + n;
}

/**
 * Creates an element from the given HTML string.
 *
 * @param {string} htmlString - The HTML string to create element from
 * @return {Element} The created element
 */
function createElementFromHTML(htmlString) {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

let dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

Date.prototype.getWeek = function () {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

function fillDate() {
  // Get the current date
  let currentDate = new Date();

  // Get the day index (0-6)
  let dayIndex = currentDate.getDay();

  // Get the day name based on the index
  let dayName = dayNames[dayIndex];

  //#region Get the month, day, year

  // Get the month index (0-11)
  let monthIndex = currentDate.getMonth();

  // Get the month name based on the index
  let monthName = monthNames[monthIndex];

  // Get the day of the month
  let monthDayNumber = currentDate.getDate();

  // Get the year
  let year = currentDate.getFullYear();

  // Create the desired date string
  let dateString = `${monthName} ${monthDayNumber} ${year}`;
  //#endregion

  Xdate.innerHTML = `<div class="text-3xl font-medium">${dayName}</div> <div>${dateString}</div>`;
}

fillDate();

function fillCalendar() {
  // Get the current date
  let currentDate = new Date();

  // Get the current month and year
  let currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1
  let currentYear = currentDate.getFullYear();

  // Set the date to the first day of the next month (day 0 of the next month)
  let nextMonthFirstDay = new Date(currentYear, currentMonth, 0);

  // Get the last day of the current month
  let daysAmount = nextMonthFirstDay.getDate();

  let calendarDayNames = ["M", "T", "W", "T", "F", "S", "S"];

  let XcalendarGridresult = "<div class='mr-3 mb-3'></div>";

  let addingElement;

  // Add day names to the calendar grid
  for (let i = 0; i < calendarDayNames.length; i++) {
    addingElement = `<div class="text-textsecondary mr-3 mb-3">${calendarDayNames[i]}</div>`;

    let XaddingElement = createElementFromHTML(addingElement);
    console.log("addingElement: ", XaddingElement);
    XcalendarGrid.appendChild(XaddingElement);
  }

  // Find the placement of the first day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  let thisMonthFirstDay = new Date(currentYear, currentMonth - 1, 0);
  let firstDayPosition = thisMonthFirstDay.getDay();

  // Calculate the number of rows the month will take
  let numRows = Math.ceil((daysAmount + firstDayPosition) / 7);

  // Loop through each row
  for (let row = -1; row < numRows; row++) {
    let currentDateA =
      row < 0
        ? new Date(currentYear, currentMonth - 2, 29)
        : new Date(currentYear, currentMonth - 1, (row + 1) * 7);
    // Don't ask I don't know wtf is that either

    // Add the week number at the start of each row
    addingElement = `<div class='mr-3 mb-3'><div class="bg-backgroundsecondary text-texttertiary inline-block p-1 px-2 rounded-lg">${n(
      currentDateA.getWeek()
    )}</div></div>`;

    let XaddingElement = createElementFromHTML(addingElement);
    console.log("addingElement: ", XaddingElement);
    XcalendarGrid.appendChild(XaddingElement);

    // Loop through each day in the row
    for (let col = 0; col < 7; col++) {
      // Calculate the day index in the grid
      let dayIndex = row * 7 + col - firstDayPosition + 1;

      let theDay = new Date(currentYear, currentMonth - 1, dayIndex);

      function currentDayClasses() {
        if (theDay.toDateString() === new Date().toDateString()) {
          return "bg-primary w-12 h-12 pt-2 -mt-2 -ml-6 absolute rounded-full hover:bg-primary2 text-white";
        }
        return "";
      }

      // Add the day or an empty div if the day is outside the current month
      if (dayIndex > 0 && dayIndex <= daysAmount) {
        addingElement = `<div class='mr-3 mb-3'><div class='inline-block p-1 ${currentDayClasses()} bg-back px-2 ${
          col > 4 ? "text-textsecondary" : ""
        }'>${n(dayIndex)}</div></div>`;
        console.log("why is this so stupid???", addingElement);
      } else if (dayIndex <= 0) {
        // Set the date to the first day of the previous month (day 0 of the previous month)
        let previousMonthFirstDay = new Date(currentYear, currentMonth - 1, 0);

        // Get the last day of the current month
        let prevMonthDaysAmount = previousMonthFirstDay.getDate();

        let nextMonthDay = dayIndex + prevMonthDaysAmount;
        addingElement = `<div class='mr-3 mb-3'><div class="inline-block p-1 ${currentDayClasses()} px-2 ${
          col > 4 ? "text-texttertiary" : "text-textsecondary"
        }">${n(nextMonthDay)}</div></div>`;
      } else {
        let nextMonthDay = dayIndex - daysAmount;
        addingElement = `<div class='mr-3 mb-3'><div class="inline-block p-1 ${currentDayClasses()} px-2 ${
          col > 4 ? "text-texttertiary" : "text-textsecondary"
        }">${n(nextMonthDay)}</div></div>`;
      }

      let XaddingElement = createElementFromHTML(addingElement);
      console.log("addingElement: ", XaddingElement);
      XcalendarGrid.appendChild(XaddingElement);
    }
  }

  // Set the inner HTML of the calendar grid
  XscrollerMonth.innerHTML = `${monthNames[currentMonth - 1]}`;
  //XcalendarGrid.innerHTML = XcalendarGridresult;
}

fillCalendar();
