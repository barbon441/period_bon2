import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addMonths } from 'date-fns';

const CalendarHeader = ({ selectedDate, handleDateChange }) => {
  const today = new Date();
  const [isOpen, setIsOpen] = useState(false);
  const datepickerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      handleDateChange(new Date());
    }, 1000 * 60 * 60 * 24);
    return () => clearInterval(interval);
  }, [handleDateChange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datepickerRef.current && !datepickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="calendar-container flex justify-between items-center p-4">
      <div className="flex items-center">
        <img
          src="https://i.pinimg.com/564x/19/de/c4/19dec471d5a17fc3c001a95737f428d0.jpg"
          alt="User Icon"
          className="user-icon w-10 h-10"
        />
      </div>
      <div className="calendar-date text-lg font-semibold flex-grow text-center">
        {selectedDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
      <div ref={datepickerRef} className="calendar-picker relative">
        <div
          className="cursor-pointer text-3xl p-2 hover:bg-gray-100 rounded-full transition-all duration-300 ease-in-out"
          onClick={() => setIsOpen(!isOpen)}
        >
          📅
        </div>
        {isOpen && (
          <div className="absolute mt-2 right-0 z-50 shadow-lg">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                handleDateChange(date); // อัปเดตวันที่ที่เลือก
                setIsOpen(false);
              }}
              maxDate={addMonths(today, 12)}
              dateFormat="dd/MM/yyyy"
              inline
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarHeader;