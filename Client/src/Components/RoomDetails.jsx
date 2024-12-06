import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import CheckIn from "./CheckIn";
import CheckOut from "./CheckOut";
import AdultsDropdown from "./AdultsDropdown";
import KidsDropdown from "./KidsDropdown";
import { RoomContext } from "../Context/RoomContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomAlert from "./Notification/CustomAlert";
import { facilities } from "../data";
function RoomDetails() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const today = new Date();
  function getTomorrowDate() {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  }
  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };
  function getUserUserid(token) {
    const decoded = jwtDecode(token);
    return decoded.user_id;
  }
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      triggerAlert("User logged off, Please sign in again", "error");
      window.location.href = "/";
    }
  });

  const [tomorrowDate, setTomorrowDate] = useState(getTomorrowDate);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrowDate);
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [aadharCardNo, setAadharCardNo] = useState("");
  const [address, setAddress] = useState("");
  const [request, setRequest] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const { rooms, adults, kids } = useContext(RoomContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const room = rooms.find((room) => {
    return room.room_id === Number(id);
  });
  const {
    room_type,
    max_persons,
    max_adults,
    selling_price,
    retail_price,
    room_id,
  } = room;
  const bookSchema = z.object({
    guestName: z
      .string()
      .trim()
      .regex(
        /^[a-zA-Z ]+$/,
        "Full name should only contain alphabets and spaces."
      )
      .min(1, "Full name is required."),

    email: z.string().email("Invalid email format."),

    phoneNo: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits."),

    aadharCardNo: z
      .string()
      .regex(/^\d{12}$/, "Aadhar card number must be exactly 12 digits."),

    address: z.string().min(1, "Address is required."),
  });
  useEffect(() => {
    if (error == "Session expired. Please log in again.") {
      triggerAlert(`${error}`, "error");
      localStorage.removeItem("token");
      window.location.href = "/";
    } else if (error == "Access denied. No token provided.") {
      triggerAlert(`${error} Please sign in`, "error");
      localStorage.removeItem("token");
      window.location.href = "/";
    } else if (error == "Invalid Token") {
      triggerAlert(`${error}! Please Sign In once again`, "error");
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }, [error]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { guestName, email, phoneNo, aadharCardNo, address };
    const validation = bookSchema.safeParse(formData);
    if (validation.success) {
      try {
        setLoading(true);
        const bookingData = {
          user_id: getUserUserid(localStorage.getItem("token")),
          guest_name: guestName,
          guest_email: email,
          guest_phone_no: phoneNo,
          address: address,
          check_in_date: startDate,
          check_out_date: endDate,
          booking_status: "pending",
          payment_status: "unpaid",
          special_requests: request,
          guest_aadhar_card: aadharCardNo,
          no_of_adults: adults,
          no_of_kids: kids,
          payment_due: parseInt(price * 1.12),
          room_id: room_id,
          checked_status: "not_checked",
        };
        console.log(bookingData);
        const response = await axios.post(
          "http://localhost:8000/api/booking/createbooking",
          { bookingData },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setError(null);
        toast.success(`${response.data.message}`);
        setTimeout(() => navigate("/"), 2000);
      } catch (error) {
        triggerAlert(
          `${error.response?.data.message || error.message}`,
          "error"
        );
        setError(`${error.response?.data.message || error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      const fieldErrors = validation.error.format();
      setError({
        guestName: fieldErrors.guestName?._errors[0],
        email: fieldErrors.email?._errors[0],
        phoneNo: fieldErrors.phoneNo?._errors[0],
        address: fieldErrors.address?._errors[0],
        aadharCardNo: fieldErrors.aadharCardNo?._errors[0],
      });
    }
  };

  return (
    <section>
      <div className="bg-room bg-cover bg-center h-[560px] relative flex justify-center items-center">
        <div className="absolute w-full h-full bg-black/70"></div>
        <h1 className="text-6xl text-white z-20 font-primary text-center">
          {room_type} Details
        </h1>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row h-full py-24">
          <div className="w-full h-full lg:w-[60%] px-6">
            <h2 className="h2">{room_type}</h2>
            <p className="mb-8">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea placeat
              eos sed voluptas unde veniam eligendi a. Quaerat molestiae hic
              omnis temporibus quos consequuntur nam voluptatum ea accusamus,
              corrupti nostrum eum placeat quibusdam quis beatae quae labore
              earum architecto aliquid debitis.
            </p>
            <img
              className="mb-8"
              src={`http://localhost:8000/public/rooms/${room_id}-lg.png`}
              alt="Large 1st Image"
            />
            <div>
              <h3 className="h3 mb-3">Room Facilities</h3>
              <p className="mb-12">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Deserunt voluptatem nulla excepturi! Soluta mollitia nisi
                corrupti deleniti dicta inventore alias cum vel? Maiores, ab
                enim. Quidem totam odit porro debitis? Sint aliquam quis itaque
                optio ducimus repudiandae impedit eaque ex quae commodi odit
                dolor nobis ipsam neque, atque illo? Sapiente id enim harum,
                voluptates exercitationem commodi et nihil nobis quia.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-12 ">
                {facilities.map((item, index) => {
                  const { name, icon } = item;
                  return (
                    <div
                      className="flex items-center gap-x-3 flex-1"
                      key={index}
                    >
                      <div className="text-3xl text-accent">{icon}</div>
                      <div className="text-base">{name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <form className="w-full h-full lg:w-[40%]">
            <div className="py-8 px-6 bg-accent/20 mb-12">
              <div className="flex flex-col space-y-4 mb-4">
                <h3>Your Reservation</h3>
                <div className="h-[60px]">
                  <CheckIn
                    today={today}
                    startDate={startDate}
                    setStartDate={setStartDate}
                  />
                </div>
                <div className="h-[60px]">
                  <CheckOut
                    startDate={startDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    tomorrowDate={tomorrowDate}
                    setTomorrowDate={setTomorrowDate}
                  />
                </div>
                <div className="h-[60px]">
                  <AdultsDropdown maxAdults={max_adults} />
                </div>
                <div className="h-[60px]">
                  <KidsDropdown maxPerson={max_persons} />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Guest Name"
                    name="guest_name"
                    className="h-[60px] w-full px-4 py-3 mb-4 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                  />
                  {error?.guestName && (
                    <p className="text-sm text-red-600">{error.guestName}</p>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    name="guest_email"
                    placeholder="Guest Email"
                    className="h-[60px] w-full px-4 py-3 mb-4 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {error?.email && (
                    <p className="text-sm text-red-600">{error.email}</p>
                  )}
                </div>
                <div>
                  <input
                    type="tel"
                    name="guest_phone_no"
                    placeholder="Guest Phone Number"
                    className="h-[60px] w-full px-4 py-3 mb-4 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    required
                  />
                  {error?.phoneNo && (
                    <p className="text-sm text-red-600">{error.phoneNo}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="guest_aadhar"
                    placeholder="Guest Aadhar Card No"
                    className="h-[60px] w-full px-4 py-3 mb-4 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={aadharCardNo}
                    onChange={(e) => setAadharCardNo(e.target.value)}
                    required
                  />
                  {error?.aadharCardNo && (
                    <p className="text-sm text-red-600">{error.aadharCardNo}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Guest Address"
                    className="h-[60px] w-full px-4 py-3 mb-4 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  {error?.address && (
                    <p className="text-sm text-red-600">{error.address}</p>
                  )}
                </div>
                <input
                  type="text"
                  name="special_requests"
                  placeholder="Special Requests"
                  className="h-[60px] w-full px-4 py-3 mb-4 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                />
                <button
                  type="submit"
                  className="h-[60px] btn btn-lg btn-primary w-full"
                  onClick={(e) => handleSubmit(e)}
                >
                  Book now for ₹{(price * 1.12).toFixed(2)}
                </button>
                <sub className="text-center">*Price calculated with GST</sub>
              </div>
            </div>
          </form>
        </div>
      </div>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-white rounded-full"></div>
        </div>
      )}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}
    </section>
  );
}

export default RoomDetails;
