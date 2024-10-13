import React from 'react';

const SymptomForm = ({ selectedSymptoms, handleSymptomChange, handleSaveSymptoms }) => {
  const categories = {
    flow: ['มามาก', 'มาปานกลาง', 'มาน้อย'],
    mood: ['เงียบสงบ', 'มีความสุข', 'กระปรี้กระเปร่า', 'หงุดหงิด', 'เศร้า', 'กระวนกระวาย', 'หดหู่', 'รู้สึกผิด', 'ไม่กระตือรือร้น', 'สับสน', 'วิจารณ์ตัวเอง', 'อารมณ์แปรปรวน'],
    symptoms: ['ปวดประจำเดือน', 'เจ็บเต้านม', 'ปวดศีรษะ', 'อ่อนเพลีย', 'เป็นสิว', 'ปวดหลัง', 'มีความอยากอาหารสูง', 'นอนไม่หลับ'],
  };

  return (
    <div className="mt-5">
      <h3 className="text-lg font-bold">เลือกอาการที่คุณรู้สึก</h3>
      {Object.entries(categories).map(([category, options]) => (
        <div key={category} className="mt-4">
          <h4 className="font-bold">{category === 'flow' ? 'ปริมาณประจำเดือน' : category === 'mood' ? 'อารมณ์' : 'อาการ'}</h4>
          {options.map((option) => (
            <label className="block mt-2" key={option}>
              <input
                type={category === 'flow' ? 'radio' : 'checkbox'}
                name={category}
                value={option}
                onChange={handleSymptomChange}
                checked={category === 'flow' ? selectedSymptoms[category] === option : selectedSymptoms[category].includes(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      <button className="bg-pink-500 text-white py-2 px-4 rounded-full" onClick={handleSaveSymptoms}>
        บันทึกอาการ
      </button>
    </div>
  );
};

export default SymptomForm;