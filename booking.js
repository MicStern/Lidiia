const lidiiaEmail = "micahel.stern@hshl.de";

const classes = [
  {
    date: "2026-05-12",
    time: "18:00",
    title: "Vinyasa Flow",
    location: "Berlin Studio",
    spots: 8
  },
  {
    date: "2026-05-14",
    time: "19:30",
    title: "Pranayama & Soft Movement",
    location: "Berlin Studio",
    spots: 6
  },
  {
    date: "2026-05-18",
    time: "18:00",
    title: "Ashtanga Basics",
    location: "Berlin Studio",
    spots: 10
  },
  {
    date: "2026-05-21",
    time: "20:00",
    title: "Tarot & Reflection Evening",
    location: "Online",
    spots: 5
  },
  {
    date: "2026-05-25",
    time: "18:00",
    title: "Vinyasa Flow",
    location: "Berlin Studio",
    spots: 8
  }
];

const calendarTitle = document.getElementById("calendarTitle");
const calendarGrid = document.getElementById("calendarGrid");
const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");
const selectedClassBox = document.getElementById("selectedClassBox");
const bookingForm = document.getElementById("bookingForm");

const bookingName = document.getElementById("bookingName");
const bookingEmail = document.getElementById("bookingEmail");
const bookingMessage = document.getElementById("bookingMessage");

let selectedClass = null;

const today = new Date();
let visibleMonth = today.getMonth();
let visibleYear = today.getFullYear();

function formatDateKey(year, monthIndex, day) {
  const month = String(monthIndex + 1).padStart(2, "0");
  const date = String(day).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

function getClassesForDate(dateKey) {
  return classes.filter((classItem) => classItem.date === dateKey);
}

function renderCalendar() {
  calendarGrid.innerHTML = "";

  const monthName = new Date(visibleYear, visibleMonth).toLocaleString("en", {
    month: "long",
    year: "numeric"
  });

  calendarTitle.textContent = monthName;

  const firstDayOfMonth = new Date(visibleYear, visibleMonth, 1);
  const lastDayOfMonth = new Date(visibleYear, visibleMonth + 1, 0);

  let startWeekday = firstDayOfMonth.getDay();
  startWeekday = startWeekday === 0 ? 7 : startWeekday;

  const daysInMonth = lastDayOfMonth.getDate();

  for (let i = 1; i < startWeekday; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day empty";
    calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(visibleYear, visibleMonth, day);
    const classesToday = getClassesForDate(dateKey);

    const dayButton = document.createElement("button");
    dayButton.type = "button";
    dayButton.className = "calendar-day";
    dayButton.innerHTML = `<span class="day-number">${day}</span>`;

    if (classesToday.length > 0) {
      dayButton.classList.add("has-class");

      const marker = document.createElement("span");
      marker.className = "class-marker";
      marker.textContent = classesToday.length === 1 ? "Class" : `${classesToday.length} classes`;
      dayButton.appendChild(marker);

      dayButton.addEventListener("click", () => {
        showClassesForDate(dateKey, classesToday);
      });
    } else {
      dayButton.disabled = true;
    }

    calendarGrid.appendChild(dayButton);
  }
}

function showClassesForDate(dateKey, classesToday) {
  const readableDate = new Date(`${dateKey}T12:00:00`).toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  selectedClassBox.innerHTML = `
    <p class="selected-date">${readableDate}</p>
    <div class="class-options">
      ${classesToday
        .map((classItem, index) => {
          return `
            <button type="button" class="class-option" data-index="${index}">
              <strong>${classItem.title}</strong>
              <span>${classItem.time} · ${classItem.location}</span>
              <small>${classItem.spots} spots available</small>
            </button>
          `;
        })
        .join("")}
    </div>
  `;

  const optionButtons = selectedClassBox.querySelectorAll(".class-option");

  optionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      optionButtons.forEach((item) => item.classList.remove("selected"));

      button.classList.add("selected");

      const selectedIndex = Number(button.dataset.index);
      selectedClass = classesToday[selectedIndex];

      selectedClassBox.dataset.selectedDate = dateKey;
    });
  });
}

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!selectedClass) {
    alert("Please select a class first.");
    return;
  }

  const name = bookingName.value.trim();
  const email = bookingEmail.value.trim();
  const message = bookingMessage.value.trim();

  const subject = `Booking request: ${selectedClass.title} on ${selectedClass.date}`;

  const body = `
Hi Lidiia,

I would like to book this class:

Class: ${selectedClass.title}
Date: ${selectedClass.date}
Time: ${selectedClass.time}
Location: ${selectedClass.location}

My name: ${name}
My email: ${email}

Message:
${message || "-"}

Thank you!
`;

  const mailtoUrl =
    `mailto:${encodeURIComponent(lidiiaEmail)}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  window.location.href = mailtoUrl;
});

prevMonthButton.addEventListener("click", () => {
  visibleMonth--;

  if (visibleMonth < 0) {
    visibleMonth = 11;
    visibleYear--;
  }

  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  visibleMonth++;

  if (visibleMonth > 11) {
    visibleMonth = 0;
    visibleYear++;
  }

  renderCalendar();
});

renderCalendar();