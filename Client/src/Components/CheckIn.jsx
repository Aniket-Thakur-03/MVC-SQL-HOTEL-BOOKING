import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../datepicker.css";
import { Calendar } from "lucide-react";
function CheckIn({ today, startDate, setStartDate }) {
  return (
    <div className="relative flex items-center justify-end h-full">
      <div className="absolute z-10 pr-8">
        <div>
          <Calendar className="text-accent text-base" />
        </div>
      </div>
      <DatePicker
        className="w-full h-full"
        selected={startDate}
        placeholderText="Check In"
        onChange={(date) => setStartDate(date)}
        minDate={today}
      />
    </div>
  );
}

export default CheckIn;
