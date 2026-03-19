const fs = require('fs');

const employees = [
  { id: 1, name: 'Ravi Kumar' },
  { id: 2, name: 'kuik' },
  { id: 3, name: 'kiran' },
  { id: 4, name: 'Jerrymerlin' },
  { id: 5, name: 'Ravi Kumar (2)' },
  { id: 6, name: 'kiran (2)' },
  { id: 7, name: 'Shivaraj' },
  { id: 8, name: 'herop' },
  { id: 9, name: 'Ravi kumar ' },
  { id: 10, name: 'Kiran (3)' }
];

const attendance = [];
let idCounter = 1;

const year = 2026;
const month = 2; // March (0-indexed) or let's use the current month
// Let's generate for March 2026 since the system time is 2026-03-19.
const daysInMonth = 31; 

for (let e of employees) {
  for (let day = 1; day <= daysInMonth; day++) {
    // Generate dates like 2026-03-01
    const dateStr = `2026-03-${day.toString().padStart(2, '0')}`;
    const dateObj = new Date(dateStr);
    
    // Skip weekends
    if (dateObj.getDay() === 0 || dateObj.getDay() === 6) {
      continue;
    }

    // Skip future days
    if (dateObj > new Date('2026-03-19')) {
      continue;
    }

    // Generate random check-in between 08:30 AM and 09:30 AM
    const checkInMins = Math.floor(Math.random() * 60);
    const checkInHour = 8 + (checkInMins >= 30 ? 0 : 1);
    const checkInTime = `${checkInHour.toString().padStart(2, '0')}:${(checkInMins % 60).toString().padStart(2, '0')} AM`;
    
    // Generate random check-out between 05:00 PM and 06:30 PM
    const checkOutMins = Math.floor(Math.random() * 90);
    const checkOutHour = 5 + Math.floor(checkOutMins / 60);
    const displayCheckOutHour = checkOutHour.toString().padStart(2, '0');
    const displayCheckOutMins = (checkOutMins % 60).toString().padStart(2, '0');
    const checkOutTime = `0${displayCheckOutHour}:${displayCheckOutMins} PM`;

    const totalHours = 8.5 + (Math.random() - 0.5); // around 8-9 hours

    attendance.push({
      id: idCounter++,
      employeeId: e.id,
      employeeName: e.name,
      date: dateStr,
      checkIn: checkInTime,
      checkOut: checkOutTime,
      hours: parseFloat(totalHours.toFixed(2)),
      status: "Present"
    });
  }
}

fs.writeFileSync('attendance.json', JSON.stringify(attendance, null, 2));
console.log('generated attendance.json with ' + attendance.length + ' records');
