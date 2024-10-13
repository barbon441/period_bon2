import React from 'react';

const Calendar = ({ selectedDate, handleDateChange, loggedDates = [], predictedDates = [] }) => {
  const selectedDay = selectedDate.getDate();
  
  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const totalDays = daysInMonth(selectedDate.getMonth(), selectedDate.getFullYear());

  const onDateClick = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    handleDateChange(newDate);
  };

  return (
    <div className="calendar-grid">
      {Array.from({ length: totalDays }, (_, index) => {
        const day = index + 1;
        const isLogged = loggedDates.some(loggedDate => loggedDate.getDate() === day);
        const isPredicted = predictedDates.some(predictedDate => predictedDate.getDate() === day);

        return (
          <div
            key={day}
            className={`calendar-day 
              ${day === selectedDay ? 'selected' : ''} 
              ${isLogged ? 'circle-logged' : ''} 
              ${isPredicted && !isLogged ? 'circle-predicted' : ''}`}
            onClick={() => onDateClick(day)}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;