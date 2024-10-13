import React from 'react';

const SaveButton = ({ selectedDate, onCycleDatesChange, onPredictedDatesChange, predictedDates, isFirstDay }) => {
  const handleLogCycle = () => {
    const today = new Date(selectedDate);

    if (isFirstDay) {
      // คำนวณวันที่คาดการณ์ 5 วันหลังจากวันบันทึกแรก
      const predictedDates = [];
      for (let i = 1; i <= 4; i++) { // แสดงอีก 4 วัน
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        predictedDates.push(nextDate);
      }

      onPredictedDatesChange(predictedDates); // ส่งวันที่คาดการณ์กลับไปที่ HomePage
    }

    // บันทึกวันที่ที่เลือก
    onCycleDatesChange(today);
  };

  return (
    <button
      className="bg-pink-500 text-white py-2 px-4 rounded-full"
      onClick={handleLogCycle}
    >
      บันทึกรอบประจำเดือน
    </button>
  );
};

export default SaveButton;