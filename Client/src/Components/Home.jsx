import Rooms from "./Rooms";
import BookForm from "./BookForm";
import HeroSlider from "./HeroSlider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  useEffect(()=>{
    if(localStorage.getItem("token") && window.location.pathname=== '/'){
      setShowModal(true); 
    }
  },[navigate]);
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
          <BookForm />
        </div>
      </div>
      <Rooms />
    </>
  );
}
