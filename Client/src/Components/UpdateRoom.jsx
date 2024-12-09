import axios from "axios";
import { useEffect, useState } from "react";
import CustomAlert from "./Notification/CustomAlert";

function UpdateRoom() {
  const [error, setError] = useState("");
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      alert("Please log in");
      window.location.href = "/";
    }
    if (error === "Session expired. Please log in again.") {
      alert(`${error}`);
      localStorage.removeItem("token");
      window.location.href = "/";
    } else if (error === "Access denied. No token provided.") {
      alert(`${error}`);
      localStorage.removeItem("token");
      window.location.href = "/";
    } else if (error === "Invalid Token") {
      alert(`${error} Please sign in again.`);
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }, [error]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/rooms");
      if (response.status === 200) {
        setRooms(response.data.rooms);
        setError("");
      }
    } catch (err) {
      console.error("Error fetching room data:", err);
      setError(`${err.response?.data.message || err.message}`);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);
  const triggerAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };
  const handleUpdatePrice = async () => {
    if (!selectedRoom || !updatedPrice) return;

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/rooms/update/room/${selectedRoom.room_id}`,
        { updatedPrice: updatedPrice },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        triggerAlert("Price updated successfully", "success");
        fetchRooms(); // Refresh room list
        setIsModalOpen(false);
        setUpdatedPrice("");
        setSelectedRoom(null);
      }
    } catch (err) {
      console.error("Error updating price:", err);
      setError(`${err.response?.data.message || err.message}`);
      triggerAlert(`${err.response?.data.message || err.message}`, "error");
    }
  };

  return (
    <div>
      <h1>Update Room Prices</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {rooms.map((room) => (
          <div
            key={room.room_id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              width: "300px",
            }}
          >
            <h3>Room ID: {room.room_id}</h3>
            <p>Room Type: {room.room_type}</p>
            <p>Retail Price: ₹{room.retail_price}</p>
            <p>Selling Price: ₹{room.selling_price}</p>
            <p>No of Rooms: {room.no_of_rooms}</p>
            <p>Max Adults: {room.max_adults}</p>
            <p>Max Persons: {room.max_persons}</p>
            <button
              onClick={() => {
                setSelectedRoom(room);
                setIsModalOpen(true);
              }}
              className="mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark transition"
            >
              Update Room Price
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <h2>Update Price for Room {selectedRoom?.room_id}</h2>
          <input
            type="number"
            placeholder="Enter new selling price"
            value={updatedPrice}
            onChange={(e) => setUpdatedPrice(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-48 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          />
          <div>
            <button
              onClick={handleUpdatePrice}
              className="mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark transition"
            >
              Submit
            </button>
            <button
              onClick={() => {
                setIsModalOpen(false);
                setUpdatedPrice("");
                setSelectedRoom(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={() => {
            setIsModalOpen(false);
            setUpdatedPrice("");
            setSelectedRoom(null);
          }}
        />
      )}
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

export default UpdateRoom;
