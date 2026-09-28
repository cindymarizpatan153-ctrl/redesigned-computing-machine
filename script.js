const STORAGE_KEY = 'attendance-tracker-state';

const state = {
  students: [],
  attendance: {},
};

const studentForm = document.getElementById('studentForm');
const studentNameInput = document.getElementById('studentName');
const studentIdInput = document.getElementById('studentId');
const attendanceDateInput = document.getElementById('attendanceDate');
const attendanceTableBody = document.getElementById('attendanceTableBody');
const saveAttendanceBtn = document.getElementById('saveAttendanceBtn');
const resetBtn = document.getElementById('resetBtn');

const presentCountEl = document.getElementById('presentCount');
const absentCountEl = document.getElementById('absentCount');
const lateCountEl = document.getElementById('lateCount');
const attendanceRateEl = document.getElementById('attendanceRate');

const defaultStatus = 'Absent';

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    state.students = [
      { id: 'S-101', name: 'Ava Johnson' },
      { id: 'S-102', name: 'Lucas Smith' },
      { id: 'S-103', name: 'Mia Brown' },
      { id: 'S-104', name: 'Noah White' },
    ];
    state.attendance = {};
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    state.students = Array.isArray(parsed.students) ? parsed.students : [];
    state.attendance = parsed.attendance && typeof parsed.attendance === 'object' ? parsed.attendance : {};
  } catch (error) {
    state.students = [];
    state.attendance = {};
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getStatusForStudent(studentId, dateKey) {
  const dayData = state.attendance[dateKey] || {};
  const status = dayData[studentId];
  return status || defaultStatus;
}

function renderAttendanceTable() {
  const selectedDate = attendanceDateInput.value || getTodayString();
  attendanceDateInput.value = selectedDate;

  if (!state.students.length) {
    attendanceTableBody.innerHTML = `
      <tr>
        <td colspan="3" class="empty-state">No students added yet. Add one to begin tracking attendance.</td>
      </tr>
    `;
    return;
  }

  attendanceTableBody.innerHTML = state.students
    .map((student) => {
      const currentStatus = getStatusForStudent(student.id, selectedDate);
      return `
        <tr>
          <td>${student.name}</td>
          <td>${student.id}</td>
          <td>
            <select data-student-id="${student.id}" aria-label="Attendance status for ${student.name}">
              <option value="Present" ${currentStatus === 'Present' ? 'selected' : ''}>Present</option>
              <option value="Absent" ${currentStatus === 'Absent' ? 'selected' : ''}>Absent</option>
              <option value="Late" ${currentStatus === 'Late' ? 'selected' : ''}>Late</option>
            </select>
          </td>
        </tr>
      `;
    })
    .join('');
}

function updateSummary() {
  const selectedDate = attendanceDateInput.value || getTodayString();
  const dayData = state.attendance[selectedDate] || {};
  const present = state.students.filter((student) => dayData[student.id] === 'Present').length;
  const absent = state.students.filter((student) => dayData[student.id] === 'Absent').length;
  const late = state.students.filter((student) => dayData[student.id] === 'Late').length;
  const total = state.students.length || 0;
  const attendanceRate = total ? Math.round(((present + late) / total) * 100) : 0;

  presentCountEl.textContent = String(present);
  absentCountEl.textContent = String(absent);
  lateCountEl.textContent = String(late);
  attendanceRateEl.textContent = `${attendanceRate}%`;
}

function render() {
  renderAttendanceTable();
  updateSummary();
}

function addStudent(event) {
  event.preventDefault();

  const name = studentNameInput.value.trim();
  const id = studentIdInput.value.trim();

  if (!name || !id) {
    alert('Please enter both student name and student ID.');
    return;
  }

  const duplicate = state.students.some((student) => student.id.toLowerCase() === id.toLowerCase());
  if (duplicate) {
    alert('A student with this ID already exists.');
    return;
  }

  state.students.push({ id, name });
  saveState();
  studentForm.reset();
  render();
}

function saveAttendance() {
  const dateKey = attendanceDateInput.value || getTodayString();
  const dayAttendance = {};

  state.students.forEach((student) => {
    const select = document.querySelector(`select[data-student-id="${student.id}"]`);
    dayAttendance[student.id] = select ? select.value : defaultStatus;
  });

  state.attendance[dateKey] = dayAttendance;
  saveState();
  render();
  alert(`Attendance saved for ${dateKey}.`);
}

function updateAttendanceFromSelect(event) {
  const select = event.target;
  if (!select.matches('select[data-student-id]')) {
    return;
  }

  const dateKey = attendanceDateInput.value || getTodayString();
  if (!state.attendance[dateKey]) {
    state.attendance[dateKey] = {};
  }

  state.attendance[dateKey][select.dataset.studentId] = select.value;
  saveState();
  updateSummary();
}

function resetData() {
  const shouldReset = window.confirm('This will delete all students and attendance records. Continue?');
  if (!shouldReset) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
  state.students = [];
  state.attendance = {};
  attendanceDateInput.value = getTodayString();
  saveState();
  render();
}

studentForm.addEventListener('submit', addStudent);
saveAttendanceBtn.addEventListener('click', saveAttendance);
attendanceTableBody.addEventListener('change', updateAttendanceFromSelect);
resetBtn.addEventListener('click', resetData);
attendanceDateInput.addEventListener('change', render);

loadState();
attendanceDateInput.value = getTodayString();
render();
