import axios from "axios";
import { User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomAlert from "./Notification/CustomAlert";
const Room = ({ room }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [noofrooms, setNoofrooms] = useState(0);
  const { id, name, image, maxAdults, maxPerson, description, price } = room;
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };
  const getNoRooms = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/rooms/noofrooms/${id}`
      );
      setNoofrooms(response.data.no_of_rooms);
    } catch (error) {
      triggerAlert(`${error.message || error.response?.data.message}`);
      setNoofrooms(-1);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setIsLoggedIn(false);
    }
  }, []);
  useEffect(() => {
    getNoRooms(id);
  }, []);
  return (
    <div className="bg-white shadow-2xl min-h-[500px] group">
      <div className="overfolw-hidden">
        <img
          className="group-hover:scale-110 transition-all duration-300 w-full"
          src={image}
          alt=""
        />
      </div>
      <div className="bg-white shadow-lg max-w-[300px] mx-auto h-[60px] -translate-y-1/2 flex items-center justify-center uppercase font-tertiary tracking-[1px] font-semibold text-base">
        <div className="flex justify-between w-[80%]">
          <div className="flex justify-evenly items-center gap-x-4">
            <div className="text-accent">
              <User className="text-[18px]" />
            </div>
            <div className="flex gap-x-1">
              <div>Adults</div>
              <div>{maxAdults}</div>
            </div>
            <div className="text-accent">
              <Users className="text-[18px]" />
            </div>
            <div className="flex gap-x-1">
              <div>Total</div>
              <div>{maxPerson}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <h3 className="h3">{name}</h3>
        <h4 className="h4">Rooms Avaiable:{noofrooms}</h4>
        <p className="max-w-[300px] mx-auto mb-3 lg:mb-6">
          {description.slice(0, 56)}
        </p>
      </div>
      <div>
        {isLoggedIn ? (
          noofrooms > 0 ? (
            <Link
              to={`/room/${id}`}
              className="btn btn-secondary btn-sm max-w-[240px] mx-auto"
            >
              Book for ₹{price}
            </Link>
          ) : (
            <button
              className="btn bg-primary btn-sm max-w-[240px] mx-auto disabled:opacity-40"
              title="Room unavailable"
              onClick={() =>
                triggerAlert("Room not avaiable to book!", "error")
              }
            >
              Book for ₹{price}
            </button>
          )
        ) : (
          <p
            onClick={() => triggerAlert("Please Login to book!", "error")}
            className="cursor-not-allowed btn btn-secondary btn-sm max-w-[240px] mx-auto"
          >
            Book for ₹{price}
          </p>
        )}
      </div>
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default Room;
