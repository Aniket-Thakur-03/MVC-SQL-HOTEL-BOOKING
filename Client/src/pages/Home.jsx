import About from "../Components/About";
import Rooms from "../Components/Rooms";
import BookForm from "../Components/BookForm";
import HeroSlider from "../Components/HeroSlider";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Modal = ({ message, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-accent text-white p-6 rounded-lg shadow-lg max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">{message}</h2>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const hasSeenModal = localStorage.getItem("hasSeenModal");

    if (token && !hasSeenModal) {
      setShowModal(true);
      localStorage.setItem("hasSeenModal", "true");
    }
  }, [navigate]);

  const handleFetchRooms = async ({
    checkIn,
    checkOut,
    adults,
    kids,
    locationId,
  }) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/rooms", {
        checkIn,
        checkOut,
        adults,
        kids,
        locationId,
      });
      if (response.status === 200) {
        setRooms(response.data.rooms);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
    setShowRooms(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <Modal message="Welcome to the homepage!" onClose={handleCloseModal} />
      )}
      <HeroSlider />
      <div className="container mx-auto relative">
        <div className="bg-accent/20 mt-4 p-4 lg:shadow-xl lg:absolute lg:left-0 lg:right-0 lg:p-0 lg:z-30 lg:-top-12">
          <BookForm onFetchRooms={handleFetchRooms} />
        </div>
      </div>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-white rounded-full"></div>
        </div>
      )}
      {showRooms ? <Rooms rooms={rooms} /> : <About />}
    </>
  );
}
