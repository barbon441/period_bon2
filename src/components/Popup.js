import React from 'react';

const Popup = ({ message }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-5 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold">{message}</h3>
    </div>
  </div>
);

export default Popup;