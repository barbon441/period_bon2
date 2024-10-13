import React, { useState } from 'react';

const PeriodTracker = () => {
  const [cycleData, setCycleData] = useState({
    startDate: '',
    endDate: '',
  });
  const [nextPeriodDate, setNextPeriodDate] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCycleData({
      ...cycleData,
      [name]: value,
    });
  };

  const calculateNextPeriod = () => {
    const cycleLength = 28; // รอบเดือนโดยเฉลี่ยคือ 28 วัน
    if (cycleData.startDate) {
      const nextPeriod = new Date(
        new Date(cycleData.startDate).getTime() + cycleLength * 24 * 60 * 60 * 1000
      );
      setNextPeriodDate(nextPeriod.toLocaleDateString()); // เก็บวันที่ถัดไปลงใน state
    }
  };

  return (
    <div className="p-5">
      

      {/* Start Date input */}
      <div className="mt-4">
        <label className="block">Start Date:</label>
        <input
          type="date"
          className="border p-2 rounded"
          name="startDate"
          value={cycleData.startDate}
          onChange={handleInputChange}
        />
      </div>

      {/* End Date input */}
      <div className="mt-4">
        <label className="block">End Date:</label>
        <input
          type="date"
          className="border p-2 rounded"
          name="endDate"
          value={cycleData.endDate}
          onChange={handleInputChange}
        />
      </div>

      {/* Calculate button */}
      <div className="mt-4">
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={calculateNextPeriod}
        >
          Calculate Next Period
        </button>
      </div>

      {/* Display Next Period Date */}
      {nextPeriodDate && (
        <p className="mt-2">Next Period is expected on: {nextPeriodDate}</p>
      )}
    </div>
  );
};

export default PeriodTracker;