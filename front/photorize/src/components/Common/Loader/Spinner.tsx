import React from 'react';
import './Spinner.css'; // CSS는 별도의 파일에 저장

const Spinner: React.FC = () => {
  return (
    <div className="dot-spinner">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="dot-spinner__dot"></div>
      ))}
    </div>
  );
};

export default Spinner;
