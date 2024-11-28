import React, { useContext, useState } from "react";
import CheckIn from "./CheckIn";
import CheckOut from "./CheckOut";
import AdultsDropdown from "./AdultsDropdown";
import { RoomContext } from "../Context/RoomContext";
import KidsDropdown from "./KidsDropdown";
const BookForm = () => {
  const today = new Date();
  function getTomorrowDate() {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  }
  const [tomorrowDate, setTomorrowDate] = useState(getTomorrowDate);
  const { handleClick } = useContext(RoomContext);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrowDate);
  return (
    <form className="h-[300px] w-full lg:h-[70px]">
      <div className="flex flex-col w-full h-full lg:flex-row">
        <div className="flex-1 border-r">
          <CheckIn
            today={today}
            startDate={startDate}
            setStartDate={setStartDate}
          />
        </div>
        <div className="flex-1 border-r">
          <CheckOut
            startDate={startDate}
            setTomorrowDate={setTomorrowDate}
            tomorrowDate={tomorrowDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>
        <div className="flex-1 border-r">
          <AdultsDropdown />
        </div>
        <div className="flex-1 border-r">
          <KidsDropdown />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          Check Now
        </button>
      </div>
    </form>
  );
};

export default BookForm;
