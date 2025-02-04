import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import CheckIn from "../Components/CheckIn";
import CheckOut from "../Components/CheckOut";
import AdultsDropdown from "../Components/common/AdultsDropdown";
import KidsDropdown from "../Components/common/KidsDropdown";
import { RoomContext } from "../Context/RoomContext";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomAlert from "../Components/Notification/CustomAlert.jsx";
import { facilities } from "../data";
import axios from "axios";
import ImageCarousel from "../Components/ImageCarousel";
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
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");
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
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const { adults, kids } = useContext(RoomContext);
  async function fetchCountries() {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/country/get/active",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status == 200) {
        setCountries(response.data.countries);
      } else {
        setCountries([]);
      }
    } catch (error) {
      console.log(error);
      {
        localStorage.getItem("isLoggedIn")
          ? triggerAlert(
              `${error.response?.data.message || error.message}`,
              "error"
            )
          : null;
      }
    }
  }
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [room, setRoom] = useState({});
  async function fetchStates(countryId) {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/state/get/active/${countryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setStates(response.data.states);
        // setErrors("");
      } else {
        setStates([]);
      }
    } catch (error) {
      // setErrors(`${error.response?.data.message || error.message}`);
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }
  async function fetchCities(stateId) {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/city/get/active/${stateId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setCities(response.data.cities);
        // setErrors("");
      } else {
        setCities([]);
      }
    } catch (error) {
      // setErrors(`${error.response?.data.message || error.message}`);
      triggerAlert(`${error.response?.data.message || error.message}`, "error");
      console.log(error);
    }
  }
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    room_name,
    max_persons,
    max_adults,
    selling_price,
    room_id,
    image_link_2,
    image_link_3,
    image_link_4,
    image_link_5,
    image_link_6,
    location_name,
    city,
    pincode,
  } = room;
  const locationRoom = { location_name, city, pincode };
  const images = [
    image_link_2,
    image_link_3,
    image_link_4,
    image_link_5,
    image_link_6,
  ].filter(Boolean);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/rooms/single/${id}`
        );
        if (response.status == 200) {
          setRoom(response.data.room);
        } else {
          setRoom({});
        }
      } catch (error) {
        triggerAlert(
          `${error.response?.data.message || error.message}`,
          "error"
        );
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
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
    fetchCountries();
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
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { guestName, email, phoneNo, aadharCardNo, address };
    const validation = bookSchema.safeParse(formData);
    if (validation.success) {
      const bookingData = {
        user_id: getUserUserid(localStorage.getItem("token")),
        guest_name: guestName,
        guest_email: email,
        guest_phone_no: phoneNo,
        address: address,
        room_price: selling_price,
        check_in_date: startDate,
        check_out_date: endDate,
        booking_status: "pending",
        payment_status: "unpaid",
        special_requests: request,
        guest_aadhar_card: aadharCardNo,
        no_of_adults: adults,
        no_of_kids: kids,
        room_id: room_id,
        checked_status: "not_checked",
        country: selectedCountryId,
        state: selectedStateId,
        city: selectedCityId,
      };
      navigate("/review-booking", {
        state: {
          bookingData,
          room,
          csc: {
            country: selectedCountryName,
            state: selectedStateName,
            city: selectedCityName,
            locationRoom: locationRoom,
          },
        },
      });
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
    <>
      {room ? (
        <section>
          <div className="bg-room bg-cover bg-center h-[560px] relative flex justify-center items-center">
            <div className="absolute w-full h-full bg-black/70"></div>

            <h1 className="text-6xl text-white z-20 font-primary text-center">
              {room_name} Details
            </h1>
          </div>
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row h-full py-24">
              <div className="w-full h-full lg:w-[60%] px-6">
                {locationRoom ? (
                  <h1 className="text-3xl text-primary z-20 font-primary text-left">
                    {`Location: ${locationRoom.location_name} -${locationRoom.city} -${locationRoom.pincode}`}
                  </h1>
                ) : null}
                <h2 className="h2">{room_name}</h2>
                <p className="mb-8">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea
                  placeat eos sed voluptas unde veniam eligendi a. Quaerat
                  molestiae hic omnis temporibus quos consequuntur nam
                  voluptatum ea accusamus, corrupti nostrum eum placeat
                  quibusdam quis beatae quae labore earum architecto aliquid
                  debitis.
                </p>
                <ImageCarousel images={images} />
                <div>
                  <h3 className="h3 mb-3">Room Facilities</h3>
                  <p className="mb-12">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Deserunt voluptatem nulla excepturi! Soluta mollitia nisi
                    corrupti deleniti dicta inventore alias cum vel? Maiores, ab
                    enim. Quidem totam odit porro debitis? Sint aliquam quis
                    itaque optio ducimus repudiandae impedit eaque ex quae
                    commodi odit dolor nobis ipsam neque, atque illo? Sapiente
                    id enim harum, voluptates exercitationem commodi et nihil
                    nobis quia.
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
                        <p className="text-sm text-red-600">
                          {error.guestName}
                        </p>
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
                        <p className="text-sm text-red-600">
                          {error.aadharCardNo}
                        </p>
                      )}
                    </div>
                    <div>
                      <select
                        className="mb-4 px-4 py-2 border rounded w-full"
                        onChange={(e) => {
                          const countryId = e.target.value;
                          setSelectedCountryId(countryId);
                          setSelectedStateId(null); // Reset state selection
                          setSelectedCityId(null); // Reset city selection
                          setStates([]); // Clear states
                          setCities([]); // Clear cities
                          setSelectedCountryName(
                            e.target.options[e.target.selectedIndex].text
                          );
                          if (countryId) {
                            fetchStates(countryId);
                          }
                        }}
                        value={selectedCountryId || ""}
                      >
                        <option value="" disabled>
                          Select a country
                        </option>
                        {countries.map((country) => (
                          <option
                            key={country.country_id}
                            value={country.country_id}
                          >
                            {country.country_name} ({country.country_iso_code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <select
                        className="mb-4 px-4 py-2 border rounded w-full"
                        onChange={(e) => {
                          const stateId = e.target.value;
                          setSelectedStateId(stateId);
                          setSelectedCityId(null); // Reset city selection
                          setCities([]); // Clear cities
                          setSelectedStateName(
                            e.target.options[e.target.selectedIndex].text
                          );
                          if (stateId) {
                            fetchCities(stateId);
                          }
                        }}
                        value={selectedStateId || ""}
                      >
                        <option value="" disabled>
                          Select a State & UTs'
                        </option>
                        {states.map((state) => (
                          <option key={state.state_id} value={state.state_id}>
                            {state.state_name} ({state.state_code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <select
                        className="mb-4 px-4 py-2 border rounded w-full"
                        onChange={(e) => {
                          const cityId = e.target.value;
                          setSelectedCityId(cityId);
                          setSelectedCityName(
                            e.target.options[e.target.selectedIndex].text
                          );
                        }}
                        value={selectedCityId || ""}
                      >
                        <option value="" disabled>
                          Select a City
                        </option>
                        {cities.map((city) => (
                          <option key={city.city_id} value={city.city_id}>
                            {city.city_name} ({city.city_std_code})
                          </option>
                        ))}
                      </select>
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
                    {localStorage.getItem("isLoggedIn") ? (
                      <button
                        type="submit"
                        className="h-[60px] btn btn-lg btn-primary w-full"
                        onClick={(e) => handleSubmit(e)}
                      >
                        Review Booking
                      </button>
                    ) : (
                      <Link
                        state={{ from: location.pathname }}
                        to="/login"
                        className="h-[100px] btn btn-lg btn-primary w-full"
                        replace={true}
                      >
                        Login to Book
                      </Link>
                    )}
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
      ) : (
        <div className="mx-auto min-h-screen">Loading</div>
      )}
    </>
  );
}

export default RoomDetails;
