// X for html (xml)
let Xdate = document.querySelector(".date");
let XscrollerMonth = document.querySelector(".scrollerMonth");
let XcalendarGrid = document.querySelector(".calendarGrid");
let XtodoPopup = document.querySelector(".todo");
let XcloseTodoPopupButton = document.querySelector(".closeToDoPopupButton");
let XaddTodoPopupButton = document.querySelector(".addToDoButton");
let XsumbitTodoButton = document.querySelector(".newTodoSumbitButton");
//let XselectedElement = document.querySelector(".addToDoPopupButton");

let XcalendarButtonLeft = document.querySelector(".calendarButtonLeft");
let XcalendarButtonRight = document.querySelector(".calendarButtonRight");

let Xevents = document.querySelectorAll(".event");

let selectedDate = null;

let selectedCalendarMonth = 0;

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

function addUniqueClass(className, givenElement, parent) {
  var children = [].slice.call(parent.children);
  children.forEach((element) => {
    if (element.firstChild && element.firstChild.classList) {
      element.firstChild.classList.remove(className);
    }
  });
  if (!givenElement.firstChild.classList.contains(className)) {
    givenElement.firstChild.classList.add(className);
  }
}

function fillCalendar() {
  // Get the current date
  let currentDate = new Date();

  // Get the current month and year
  let currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1
  let currentYear = currentDate.getFullYear();

  // Set the date to the first day of the next month (day 0 of the next month)
  let nextMonthFirstDay = new Date(
    currentYear,
    currentMonth + selectedCalendarMonth,
    0
  );

  // Get the last day of the current month
  let daysAmount = nextMonthFirstDay.getDate();

  let calendarDayNames = ["M", "T", "W", "T", "F", "S", "S"];

  let addingElement;

  function addElementToGrid(addingElement) {
    let XaddingElement = createElementFromHTML(addingElement);
    XaddingElement.addEventListener("click", () => {
      let selected = XaddingElement.getAttribute("data-date");
      if (selected) {
        addUniqueClass("selected", XaddingElement, XcalendarGrid);
        selectedDate = selected;

        removeToDoPopup();
        addToDoPopup();
      }
    });
    XcalendarGrid.appendChild(XaddingElement);
  }
  addElementToGrid("<div class='gridElementUnselectable'></div>");

  // Add day names to the calendar grid
  for (let i = 0; i < calendarDayNames.length; i++) {
    addingElement = `<div class="text-textsecondary gridElementUnselectable">${calendarDayNames[i]}</div>`;

    addElementToGrid(addingElement);
  }

  // Find the placement of the first day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  let thisMonthFirstDay = new Date(
    currentYear,
    currentMonth - 1 + selectedCalendarMonth,
    0
  );
  let firstDayPosition = thisMonthFirstDay.getDay();

  // Calculate the number of rows the month will take
  let numRows = Math.ceil((daysAmount + firstDayPosition) / 7);

  for (let row = -1; row < numRows; row++) {
    let currentDateA =
      row < 0
        ? new Date(currentYear, currentMonth - 2 + selectedCalendarMonth, 29)
        : new Date(
            currentYear,
            currentMonth - 1 + selectedCalendarMonth,
            (row + 1) * 7
          );
    // Don't ask I don't know wtf is that either

    // Add the week number at the start of each row
    addingElement = `<div class='gridElementUnselectable'><div class="bg-backgroundsecondary text-texttertiary inline-block p-1 px-2 rounded-lg">${n(
      currentDateA.getWeek()
    )}</div></div>`;

    addElementToGrid(addingElement);

    // Loop through each day in the row
    for (let col = 0; col < 7; col++) {
      // Calculate the day index in the grid
      let dayIndex = row * 7 + col - firstDayPosition + 1;

      let theDay = new Date(
        currentYear,
        currentMonth - 1 + selectedCalendarMonth,
        dayIndex
      );

      function currentDayClasses() {
        return theDay.toDateString() === new Date().toDateString()
          ? "currentDay"
          : "";
      }

      if (dayIndex > 0 && dayIndex <= daysAmount) {
        // For days in the month
        addingElement = `<div data-date='${theDay.toDateString()}' class='gridElement'><button class='inline-block p-1 ${currentDayClasses()} bg-back px-2 ${
          col > 4 ? "text-textsecondary" : ""
        }'>${n(dayIndex)}</button></div>`;
      } else if (dayIndex <= 0) {
        // For days before the first day of the month
        let previousMonthFirstDay = new Date(
          currentYear,
          currentMonth - 1 + selectedCalendarMonth,
          0
        );

        // Get the last day of the current month
        let prevMonthDaysAmount = previousMonthFirstDay.getDate();

        let nextMonthDay = dayIndex + prevMonthDaysAmount;
        addingElement = `<div data-date='${theDay.toDateString()}' class='gridElement'><button class="inline-block p-1 ${currentDayClasses()} px-2 ${
          col > 4 ? "text-texttertiary" : "text-textsecondary"
        }">${n(nextMonthDay)}</button></div>`;
      } else {
        // For days after the last day of the month
        let nextMonthDay = dayIndex - daysAmount;
        addingElement = `<div data-date='${theDay.toDateString()}' class='gridElement'><button class="inline-block p-1 ${currentDayClasses()} px-2 ${
          col > 4 ? "text-texttertiary" : "text-textsecondary"
        }">${n(nextMonthDay)}</button></div>`;
      }

      addElementToGrid(addingElement);
    }
  }

  const wrappedIndex = (currentMonth - 1 + selectedCalendarMonth) % 12;
  const positiveIndex = (wrappedIndex + 12) % 12;

  XscrollerMonth.innerHTML = `${
    monthNames[positiveIndex]
  } ${nextMonthFirstDay.getFullYear()}`;
}

fillCalendar();

function deleteCalendar() {
  XcalendarGrid.innerHTML = "";
}

XcalendarButtonLeft.addEventListener("click", () => {
  selectedCalendarMonth -= 1;
  deleteCalendar();
  fillCalendar();
});
XcalendarButtonRight.addEventListener("click", () => {
  selectedCalendarMonth += 1;
  deleteCalendar();
  fillCalendar();
});

async function addToDoPopup() {
  if (!selectedDate) {
    XtodoPopup.innerHTML = "";
    return;
  }
  let selectedDateTrue = new Date(selectedDate);

  let selectedDateTitle = selectedDateTrue.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  // Ease of read
  if (selectedDateTrue.toDateString() === new Date().toDateString()) {
    selectedDateTitle = "Today";
  } else if (
    selectedDateTrue.toDateString() ===
    new Date(new Date().setDate(new Date().getDate() + 1)).toDateString()
  ) {
    selectedDateTitle = "Tomorrow";
  } else if (
    selectedDateTrue.toDateString() ===
    new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()
  ) {
    selectedDateTitle = "Yesterday";
  }

  let Xevents = "";

  try {
    //console.log(selectedDate);
    const JSONdata = await axios.get("/data?date=" + selectedDate);

    // Assuming JSONdata.data is an array of objects with a 'time' property
    const sortedData = JSONdata.data.sort((a, b) => {
      // Convert time strings to comparable format (e.g., minutes since midnight)
      const timeA = convertTimeToMinutes(a.time);
      const timeB = convertTimeToMinutes(b.time);

      // Compare and return the result of the comparison
      return timeA - timeB;
    });

    function convertTimeToMinutes(timeString) {
      const [hours, minutes] = timeString.split(":");
      return parseInt(hours) * 60 + parseInt(minutes);
    }

    sortedData.forEach((event) => {
      Xevents += `<div class="event">
                    <div class="text-xl inline-block font-medium text-textsecondary">
                      <div class="eventTime group flex items-center">
                        ${event.time}
                        <div class="w-3"></div>
                        <button class="deleteEventButton text-2xl font-black text-textsecondary select-none transition-all hover:text-danger scale-0 group-hover:scale-100 duration-300 origin-center">✕</button>
                      </div>
                    </div> 
                    <div class="eventTitle ml-1 text-2xl font-medium text-white break-all">${event.title}</div> 
                    <div class="eventDescription ml-1 text-xl font-normal text-textmain break-all">${event.description}</div>
                  </div>`;
      //console.log(event);
    });

    //console.log(JSONdata);
  } catch (error) {
    console.log(error);
  }

  let XaddToDoPopup = `
                    <div class="flex w-[99%] mt-1 relative flex-col gap-3 bg-backgroundblock rounded-xl p-5 pt-4 text-textmain">
                      <div class="text-center absolute top-[0.9rem] right-6">
                        <button class="addToDoButton text-2xl font-normal text-textsecondary select-none transition-colors hover:text-success">🞣</button>
                        <button class="closeToDoPopupButton text-2xl font-black text-textsecondary select-none transition-colors hover:text-danger">✕</button>
                      </div>
                      <div>
                        <div class="text-2xl inline-block font-medium text-textsecondary hover:text-textmain transition-colors">${selectedDateTitle}</div>
                      </div>
                      <hr class="border-textsecondary"/>
                      ${Xevents}
                    </div>`;

  XtodoPopup.innerHTML = XaddToDoPopup;
  XcloseTodoPopupButton = document.querySelector(".closeToDoPopupButton");
  XcloseTodoPopupButton.addEventListener("click", () => {
    unselect();
  });
  XaddTodoPopupButton = document.querySelector(".addToDoButton");
  XaddTodoPopupButton.addEventListener("click", () => {
    addToDo();
  });

  Xevents = document.querySelectorAll(".event");
  console.log(Xevents, Xevents.childNodes, Xevents.children);
  Xevents.forEach((element) => {
    let XdeleteButton = element.querySelector(".deleteEventButton");

    XdeleteButton.addEventListener("click", () => {
      console.log("376 trying to delete event: ", element);
      deleteToDo(element);
    });
  });
}

function removeToDoPopup() {
  //XtodoPopup.innerHTML = "";
}

function unselect() {
  selectedDate = null;
  let XselectedElement = document.querySelector(".selected");
  if (XselectedElement) {
    XselectedElement.classList.remove("selected");
  }
  addToDoPopup();
}

function addToDo() {
  if (!selectedDate) {
    return;
  }
  let XtodoPopup = document.querySelector(".todo");
  if (!XtodoPopup) {
    return;
  }
  let XnewToDoForm =
    createElementFromHTML(`<form class="newToDoForm flex flex-col gap-1">
    <p class="text-2xl font-medium text-main">Add new Event</p>
    <label for="time">Time</label>
    <input class="p-1 px-2 rounded bg-texttertiary" id="time" type="time">

    <label for="title">Title</label>
    <input class="p-1 px-2 rounded bg-texttertiary" id="title" type="text">

    <label for="description">Description</label>
    <input class="p-1 px-2 rounded bg-texttertiary" id="description" type="text">

    <div><button type="button" class="newTodoSumbitButton rounded-xl px-4 text-xl mt-2 p-2 font-normal text-textmain bg-texttertiary select-none transition-colors hover:text-success">Submit</button></div>
    <hr class="border-textsecondary mt-2"/>
  </form>`);

  let hrElement = document.querySelector("section.todo > div > hr");

  // Check if the hr element exists
  if (hrElement) {
    // Insert the new form after the hr element
    hrElement.insertAdjacentElement("afterend", XnewToDoForm);

    XsumbitTodoButton = document.querySelector(".newTodoSumbitButton");
    XsumbitTodoButton.addEventListener("click", () => {
      let time = document.querySelector("#time").value;
      let title = document.querySelector("#title").value;
      let description = document.querySelector("#description").value;

      console.log("data sent", selectedDate, time, title, description);

      axios
        .post("/setdata", {
          date: selectedDate,
          time: time,
          title: title,
          description: description,
        })
        .then(function (response) {
          let XnewToDoElement = createElementFromHTML(
            `<div class="event">
                    <div class="text-xl inline-block font-medium text-textsecondary">
                      <div class="eventTime group flex items-center">
                        ${time}
                        <div class="w-3"></div>
                        <button class="deleteEventButton text-2xl font-black text-textsecondary select-none transition-all hover:text-danger scale-0 group-hover:scale-100 duration-300 origin-center">✕</button>
                      </div>
                    </div> 
                    <div class="eventTitle ml-1 text-2xl font-medium text-white break-all">${title}</div> 
                    <div class="eventDescription ml-1 text-xl font-normal text-textmain break-all">${description}</div>
                  </div>`
          );
          hrElement.insertAdjacentElement("afterend", XnewToDoElement);

          let Xform = document.querySelector(".newToDoForm");
          Xform.remove();
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }
}

function deleteToDo(element) {
  if (!XtodoPopup) {
    return;
  }
  element.classList =
    "event transition-transform origin-top-left duration-200 scale-0";

  setTimeout(() => {
    let time = element
      .querySelector(".eventTime")
      .firstChild.textContent.replace(/ /g, "")
      .replace(/(\r\n|\n|\r)/gm, "");
    console.log(
      "475 time: ",
      element
        .querySelector(".eventTime")
        .firstChild.textContent.replace(/(\r\n|\n|\r)/gm, "")
        .replace(/ /g, "")
    );
    let title = element.querySelector(".eventTitle").textContent;
    let description = element.querySelector(".eventDescription").textContent;

    // Get the content you want to match
    let contentToMatch = element.textContent.trim();

    // Find and remove the element with the matching content from XtodoPopup
    let events = XtodoPopup.querySelectorAll(".event");
    for (let event of events) {
      if (event.textContent.trim() === contentToMatch) {
        event.remove();
        break; // Remove only the first matching element (if there are multiple)
      }
    }

    axios
      .post("/removedata", {
        date: selectedDate,
        time: time,
        title: title,
        description: description,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, 200);
}
