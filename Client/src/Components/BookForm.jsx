import React, { useState } from "react";
import CheckIn from "./CheckIn";
import CheckOut from "./CheckOut";
import AdultsDropdown from "./AdultsDropdown";
import KidsDropdown from "./KidsDropdown";
import LocationSearch from "./LocationSearch";
import CustomAlert from "./Notification/CustomAlert";

const BookForm = ({ onFetchRooms }) => {
  const today = new Date();
  function getTomorrowDate() {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  }
  const [tomorrowDate, setTomorrowDate] = useState(getTomorrowDate);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrowDate);
  const [adults, setAdults] = useState(1); // Track adults
  const [kids, setKids] = useState(0); // Track kids
  const [selectedLocationId, setSelectedLocationId] = useState(""); // Track location selection
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };
  return (
    <form className="h-[300px] w-full lg:h-[70px]">
      <div className="flex flex-col w-full h-full lg:flex-row">
        <div className="flex-1 border-r">
          <LocationSearch
            selectedLocationId={selectedLocationId}
            setSelectedLocationId={setSelectedLocationId}
          />
        </div>
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
          <AdultsDropdown setAdults={setAdults} />
        </div>
        <div className="flex-1 border-r">
          <KidsDropdown setKids={setKids} />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            const searchParams = {
              checkIn: startDate,
              checkOut: endDate,
              adults,
              kids,
              locationId: selectedLocationId,
            };
            if (!selectedLocationId) {
              triggerAlert("Please select location for searching", "error");
              return;
            }

            onFetchRooms(searchParams); // Pass all collected data
          }}
        >
          Check Now
        </button>
      </div>
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}
    </form>
  );
};

export default BookForm;
