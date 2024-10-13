import React, { useState } from 'react';
import SaveButton from './SaveButton';
import Calendar from './Calendar';
import SymptomForm from './SymptomForm';
import './homePage.css';

const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cycleDates, setCycleDates] = useState([]);
  const [predictedDates, setPredictedDates] = useState([]);
  const [dailySymptoms, setDailySymptoms] = useState({});
  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState({ flow: '', mood: [], symptoms: [] });
  const [currentDayOfPeriod, setCurrentDayOfPeriod] = useState(1); // สำหรับเก็บวันที่ในรอบประจำเดือน
  const [isSaved, setIsSaved] = useState(false);
  const [isFirstDay, setIsFirstDay] = useState(true); // ตรวจสอบว่าเป็นวันแรกหรือไม่
  const [nextPeriodDate, setNextPeriodDate] = useState(null); // บันทึกวันที่ประจำเดือนครั้งถัดไป
  const [lastPeriodDay, setLastPeriodDay] = useState(null); // เก็บวันสุดท้ายของการเป็นประจำเดือน

  // ฟังก์ชันจัดการการเปลี่ยนแปลงวันที่
// ฟังก์ชันจัดการการเปลี่ยนแปลงวันที่
const handleDateChange = (newDate) => {
  setSelectedDate(newDate);

  // ตรวจสอบว่ามีการบันทึกวันที่นี้แล้วหรือไม่
  const existingIndex = cycleDates.findIndex(
    (loggedDate) => loggedDate.getTime() === newDate.getTime()
  );

  if (existingIndex !== -1) {
    // ถ้ามีวันที่นี้ใน cycleDates ให้แสดงข้อความวันที่ตามลำดับที่บันทึกไว้
    setCurrentDayOfPeriod(existingIndex + 1);
    setIsSaved(true); // แสดงข้อมูลว่าบันทึกแล้ว
  } else {
    // ถ้าไม่มีวันที่นี้ให้รีเซ็ตสถานะการบันทึก
    setIsSaved(false);
  }
};

  // ฟังก์ชันสำหรับบันทึกวันที่ที่เลือก
  const handleLogCycle = (date) => {
    const updatedCycleDates = [...cycleDates, date];
    setCycleDates(updatedCycleDates);
    localStorage.setItem('cycleDates', JSON.stringify(updatedCycleDates)); // บันทึกข้อมูลใน localStorage
    setIsSaved(true);
    setCurrentDayOfPeriod(cycleDates.length + 1);
    setIsFirstDay(false);
  
    if (isFirstDay) {
      const calculatedNextPeriod = calculateNextPeriod(date);
      setNextPeriodDate(calculatedNextPeriod);
      calculatePredictedDates(date);
      const lastDayOfPeriod = calculateLastPeriodDay(date);
      setLastPeriodDay(lastDayOfPeriod);
    }
  };
  // ฟังก์ชันคำนวณวันสุดท้ายของการมีประจำเดือน
  const calculateLastPeriodDay = (startDate) => {
    const periodLength = 5; // กำหนดให้ประจำเดือนอยู่ 5 วัน
    const lastDay = new Date(startDate);
    lastDay.setDate(startDate.getDate() + periodLength - 1); // วันสุดท้ายคือวันที่ 5 หลังจากวันแรก
    return lastDay;
  };

  // ฟังก์ชันคำนวณวันที่ประจำเดือนจะมาอีก
  const calculateNextPeriod = (startDate) => {
    const cycleLength = 28; // รอบประจำเดือนเฉลี่ย 28 วัน
    const lastPeriodDay = calculateLastPeriodDay(startDate); // เอาวันสุดท้ายของประจำเดือน (วันที่ 5)
    const nextPeriodDate = new Date(lastPeriodDay);
    nextPeriodDate.setDate(lastPeriodDay.getDate() + 1 + cycleLength); // บวก 1 เพื่อเริ่มจากวันที่ 6 แล้วเพิ่ม 28 วันสำหรับรอบถัดไป
    return nextPeriodDate;
  };

  // ฟังก์ชันคำนวณวันคาดการณ์ 5 วันหลังจากวันแรก
  const calculatePredictedDates = (startDate) => {
    const predicted = [];
    for (let i = 0; i < 5; i++) { // คำนวณ 5 วัน (รวมวันแรก)
      const predictedDate = new Date(startDate);
      predictedDate.setDate(startDate.getDate() + i);
      predicted.push(predictedDate);
    }
    setPredictedDates(predicted); // บันทึกวันคาดการณ์ทั้ง 5 วัน
  };

  // ฟังก์ชันคำนวณจำนวนวันที่เหลือจากวันที่เลือกไปถึงวันประจำเดือนรอบถัดไป
  const calculateDaysUntilNextPeriod = () => {
    if (!nextPeriodDate) return null;
    const today = selectedDate || new Date(); // ใช้วันที่ที่เลือกจากผู้ใช้หรือวันที่ปัจจุบัน
    const diffTime = Math.abs(nextPeriodDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // แปลงเป็นจำนวนวัน
    return diffDays;
  };

  // ฟังก์ชันตรวจสอบว่าวันที่เลือกเป็นวันที่ประจำเดือนหรือไม่
  const isPeriodDay = predictedDates.some(predictedDate => predictedDate.toDateString() === selectedDate.toDateString());

  const handleLogSymptoms = () => setShowSymptomForm(true);

  const handleSymptomChange = (e) => {
    const { name, value, checked } = e.target;
    setSelectedSymptoms((prev) => ({
      ...prev,
      [name]: name === 'flow' ? value : checked
        ? [...prev[name], value]
        : prev[name].filter((item) => item !== value),
    }));
  };

  const handleSaveSymptoms = () => {
    setDailySymptoms({ ...dailySymptoms, [selectedDate]: selectedSymptoms });
    setShowSymptomForm(false);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  // ฟังก์ชันแปลงวันที่เป็นรูปแบบภาษาไทย
  const formatThaiDate = (date) => {
    const months = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  };

  // ตรวจสอบว่าวันนี้อยู่ในช่วงของการมีประจำเดือนหรือไม่
  const isInPeriod = currentDayOfPeriod <= 5; // กำหนดให้ช่วงประจำเดือนอยู่ที่ 5 วัน

  return (
    <div className="home-page-container">
      <div className="period-info-container">
        {isSaved && isInPeriod ? (
          <>
            <div className="period-info-title period-info-title-small">
              ประจำเดือน:
            </div>
            <div className="period-info-title period-info-title-large">
              วันที่ {currentDayOfPeriod}
            </div>
          </>
        ) : (
          <>
            {nextPeriodDate && !isPeriodDay && ( // ไม่แสดงข้อความนี้หากเป็นวันประจำเดือน
              <div className="period-info-days">
                ประจำเดือนจะมาอีก: {formatThaiDate(nextPeriodDate)}
              </div>
            )}
            {nextPeriodDate && !isPeriodDay && ( // ไม่แสดงจำนวนวันหากเป็นวันประจำเดือน
              <div className="period-info-days">
                จากวันนี้ถึงวันที่ประจำเดือนจะมาอีก เป็นเวลา: {calculateDaysUntilNextPeriod()} วัน
              </div>
            )}
          </>
        )}
      </div>

      {/* ปฏิทินแสดงวันที่ */}
      <h3 className="calendar-title">ปฏิทินรอบเดือน</h3>
      <div className="calendar-container">
        <Calendar 
          selectedDate={selectedDate} 
          handleDateChange={handleDateChange} 
          loggedDates={cycleDates} 
          predictedDates={predictedDates} 
        />
      </div>

      {/* บันทึกวันที่รอบเดือน */}
      <div className="save-button-container">
        <SaveButton 
          selectedDate={selectedDate}
          onCycleDatesChange={handleLogCycle} 
          onPredictedDatesChange={setPredictedDates} 
        />
      </div>  

      <div className="daily-insights-container">
        <div className="daily-insights-title">ข้อมูลเชิงลึกประจำวันของฉัน - {selectedDate.toLocaleDateString('th-TH')}</div>
        <div className="insights-grid">
          <div className="insight-card">
            <div>บันทึกอาการของคุณ</div>
            <div className="add-symptom-button" onClick={handleLogSymptoms}>+</div>
          </div>
        </div>
      </div>

      {showSymptomForm && (
        <SymptomForm
          selectedSymptoms={selectedSymptoms}
          handleSymptomChange={handleSymptomChange}
          handleSaveSymptoms={handleSaveSymptoms}
        />
      )}

      {dailySymptoms[selectedDate] && (
        <div className="symptom-summary-container">
          <h3 className="symptom-summary-title">สรุปอาการของคุณ</h3>
          <p className="symptom-summary-item">ปริมาณประจำเดือน: {dailySymptoms[selectedDate].flow || 'ไม่ได้ระบุ'}</p>
          <p className="symptom-summary-item">อารมณ์: {dailySymptoms[selectedDate].mood.join(', ') || 'ไม่ได้ระบุ'}</p>
          <p className="symptom-summary-item">อาการ: {dailySymptoms[selectedDate].symptoms.join(', ') || 'ไม่ได้ระบุ'}</p>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3 className="popup-title">บันทึกอาการของคุณแล้ว</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
