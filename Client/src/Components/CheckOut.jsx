import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../datepicker.css";
import { Calendar } from "lucide-react";
import { useEffect } from "react";

function CheckOut({
  tomorrowDate,
  endDate,
  setEndDate,
  startDate,
  setTomorrowDate,
}) {
  function getTomorrowDate(startDate) {
    const tomorrow = new Date(startDate);
    tomorrow.setDate(startDate.getDate() + 1);
    return tomorrow;
  }
  useEffect(() => {
    const Tdate = getTomorrowDate(startDate);
    setTomorrowDate(Tdate);
    setEndDate(Tdate);
  }, [startDate]);
  return (
    <div className="relative flex items-center justify-end h-full">
      <div className="absolute z-10 pr-8">
        <div>
          <Calendar className="text-accent text-base" />
        </div>
      </div>
      <DatePicker
        className="w-full h-full"
        selected={endDate}
        placeholderText="Check Out"
        onChange={(date) => setEndDate(date)}
        minDate={tomorrowDate}
      />
    </div>
  );
}

export default CheckOut;
