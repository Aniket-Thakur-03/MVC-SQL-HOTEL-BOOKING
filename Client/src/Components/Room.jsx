import { User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomAlert from "./Notification/CustomAlert";
const Room = ({ room }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const {
    room_id,
    room_name,
    image_link_1,
    no_of_rooms,
    max_adults,
    meals_available,
    max_persons,
    retail_price,
    selling_price,
  } = room;

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setIsLoggedIn(false);
    }
  }, []);
  return (
    <div className="bg-white shadow-2xl min-h-[500px] group">
      <div className="overfolw-hidden">
        <img
          className="group-hover:scale-110 transition-all duration-300 w-full"
          src={`http://localhost:8000${image_link_1}`}
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
              <div>{max_adults}</div>
            </div>
            <div className="text-accent">
              <Users className="text-[18px]" />
            </div>
            <div className="flex gap-x-1">
              <div>Total</div>
              <div>{max_persons}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <h3 className="h3">{room_name}</h3>
        <h4 className="h4">Rooms Avaiable:{no_of_rooms}</h4>
        <p className="max-w-[300px] mx-auto mb-3 lg:mb-6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>

      <div>
          <Link
            to={`/room/${room_id}`}
            className="btn btn-secondary btn-sm max-w-[240px] mx-auto"
          >
            {selling_price !== retail_price ? (
              <div>
                ₹{selling_price}
                {"  "}
                <span className="mx-2 line-through">₹{retail_price}</span>
              </div>
            ) : (
              <div>₹{selling_price}</div>
            )}
          </Link>
      </div>
      <div
        className={`text-center text-base ${
          meals_available ? "text-green-500" : "text-red-500"
        }`}
      >
        {meals_available ? "Meals Available" : "Meals Not Available"}
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
