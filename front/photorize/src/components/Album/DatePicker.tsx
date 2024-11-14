import React from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";

interface CustomDatepickerProps {
  value: DateValueType;
  onChange: (value: DateValueType) => void;
}

const DatePicker: React.FC<CustomDatepickerProps> = ({ value, onChange }) => {
  return (
    <div className="relative flex items-center bg-white rounded-lg p-4 w-full max-w-md mb-4 border border-[#B3B3B3] relative">
      <img src="/assets/date-icon.png" alt="Date Icon" className="h-5" />
      <Datepicker
        useRange={false}
        asSingle={true}
        maxDate={new Date()}
        value={value}
        onChange={onChange}
        inputClassName="pl-1 ml-2 w-full bg-transparent text-sm text-[#818181] placeholder-[#BCBFC3] placeholder:font-md outline-none"
        placeholder="추억 날짜"
        displayFormat="YYYY-MM-DD"
        readOnly={true}
        toggleClassName="hidden"
        popoverDirection="down"
        primaryColor="pink"
      />
    </div>
  );
};

export default DatePicker;
