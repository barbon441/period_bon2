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
  const [nextPeriodDate, setNextPeriodDate] = useState(null); // บันทึกวันที่ประจำเดือนครั้งถัดไป
  const [lastPeriodDay, setLastPeriodDay] = useState(null); // เก็บวันสุดท้ายของการเป็นประจำเดือน

  // ฟังก์ชันจัดการการเปลี่ยนแปลงวันที่
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setIsSaved(false); // รีเซ็ตสถานะเมื่อเปลี่ยนวันที่
  };

  // ฟังก์ชันสำหรับบันทึกวันที่ที่เลือก
  const handleLogCycle = (date) => {
    const dateString = date.toDateString();

    // ตรวจสอบว่าบันทึกวันต่อเนื่องหรือไม่
    if (!cycleDates.some(cycleDate => cycleDate.toDateString() === dateString)) {
      if (cycleDates.length > 0) {
        const lastLoggedDate = new Date(cycleDates[cycleDates.length - 1]);
        const diffDays = Math.ceil(Math.abs(date - lastLoggedDate) / (1000 * 60 * 60 * 24));

        // ถ้าบันทึกต่อเนื่อง
        if (diffDays === 1) {
          const updatedCycleDates = [...cycleDates, date];
          setCycleDates(updatedCycleDates);
          setCurrentDayOfPeriod(updatedCycleDates.length); // แสดงวันประจำเดือนวันที่ X

          // คำนวณวันประจำเดือนถัดไป
          const calculatedNextPeriod = calculateNextPeriod(date);
          setNextPeriodDate(calculatedNextPeriod);
        } else {
          // ถ้าไม่ต่อเนื่อง รีเซ็ตข้อมูล
          setCycleDates([date]);
          setCurrentDayOfPeriod(1); // เริ่มต้นที่ประจำเดือนวันที่ 1
          const calculatedNextPeriod = calculateNextPeriod(date);
          setNextPeriodDate(calculatedNextPeriod);

          // คำนวณวันคาดการณ์ใหม่
          calculatePredictedDates(date);
        }
      } else {
        // บันทึกครั้งแรก
        setCycleDates([date]);
        setCurrentDayOfPeriod(1);
        const calculatedNextPeriod = calculateNextPeriod(date);
        setNextPeriodDate(calculatedNextPeriod);

        // คำนวณวันคาดการณ์จากวันแรก
        calculatePredictedDates(date);
      }
      setIsSaved(true);
    }
  };

  // ฟังก์ชันคำนวณวันประจำเดือนถัดไป
  const calculateNextPeriod = (startDate) => {
    const cycleLength = 28; // รอบประจำเดือนเฉลี่ย 28 วัน
    const nextPeriodDate = new Date(startDate);
    nextPeriodDate.setDate(startDate.getDate() + cycleLength);
    return nextPeriodDate;
  };

  // ฟังก์ชันคำนวณวันคาดการณ์ 5 วันหลังจากวันแรก
  const calculatePredictedDates = (startDate) => {
    const predicted = [];
    for (let i = 0; i < 5; i++) { 
      const predictedDate = new Date(startDate);
      predictedDate.setDate(startDate.getDate() + i);
      predicted.push(predictedDate);
    }
    setPredictedDates(predicted);
  };

  // ฟังก์ชันคำนวณจำนวนวันที่เหลือจากวันนี้ถึงวันประจำเดือนถัดไป
  const calculateDaysUntilNextPeriod = () => {
    if (!nextPeriodDate) return null;
    const today = new Date(); // ใช้วันที่ปัจจุบัน
    const diffTime = Math.abs(nextPeriodDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงของอาการที่บันทึก
  const handleSymptomChange = (e) => {
    const { name, value, checked } = e.target;
    setSelectedSymptoms((prevSymptoms) => ({
      ...prevSymptoms,
      [name]: name === 'flow' ? value : checked
        ? [...prevSymptoms[name], value]
        : prevSymptoms[name].filter((symptom) => symptom !== value)
    }));
  };

  return (
    <div className="home-page-container">
      <div className="period-info-container">
        {isSaved && (
          <>
            <div className="period-info-title period-info-title-small">
              ประจำเดือน:
            </div>
            <div className="period-info-title period-info-title-large">
              วันที่ {currentDayOfPeriod}
            </div>
          </>
        )}

        {isSaved && nextPeriodDate && (
          <div className="period-info-days">
            ประจำเดือนจะมาอีก: {nextPeriodDate.toLocaleDateString('th-TH')}
          </div>
        )}

        {isSaved && nextPeriodDate && (
          <div className="period-info-days">
            จากวันนี้ถึงวันที่ประจำเดือนจะมาอีก: {calculateDaysUntilNextPeriod()} วัน
          </div>
        )}
      </div>

      <h3 className="calendar-title">ปฏิทินรอบเดือน</h3>
      <div className="calendar-container">
        <Calendar 
          selectedDate={selectedDate} 
          handleDateChange={handleDateChange} 
          loggedDates={cycleDates} 
          predictedDates={predictedDates} 
        />
      </div>

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
            <div className="add-symptom-button" onClick={() => setShowSymptomForm(true)}>+</div>
          </div>
        </div>
      </div>

      {showSymptomForm && (
        <SymptomForm
          selectedSymptoms={selectedSymptoms}
          handleSymptomChange={handleSymptomChange}  // เรียกใช้ฟังก์ชันที่เพิ่งเพิ่ม
          handleSaveSymptoms={() => {
            setDailySymptoms({ ...dailySymptoms, [selectedDate]: selectedSymptoms });
            setShowSymptomForm(false);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
          }}
        />
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
