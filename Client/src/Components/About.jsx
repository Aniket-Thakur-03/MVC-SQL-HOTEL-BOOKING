import React from "react";
import RoomImg1 from "../assets/img/rooms/1.png";
import RoomImg2 from "../assets/img/rooms/2.png";
import RoomImg3 from "../assets/img/Restaurant/tamara-malaniy-gdiNvl_hvso-unsplash.jpg";
import RoomImg4 from "../assets/img/Restaurant/jnr-jose-I8Rf3tItuHE-unsplash.jpg";
export default function About() {
  return (
    <div className="py-16 bg-white">
      <div className="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
        <div className="text-center mb-16">
          {/* <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Our Luxury Hotel
          </h2>
          <p className="text-xl text-gray-600">
            Experience unparalleled comfort and exceptional service
          </p> */}
        </div>
        <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-12 lg:items-center">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Your Perfect Getaway
              </h3>
              <p className="text-gray-600">
                Nestled in the heart of the city, our hotel offers a perfect
                blend of luxury, comfort, and convenience. With stunning views
                and world-class amenities, we ensure your stay is nothing short
                of exceptional.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Premium Amenities
              </h3>
              <p className="text-gray-600">
                Indulge in our premium facilities including a state-of-the-art
                fitness center, spa sanctuary, rooftop infinity pool, and fine
                dining restaurants that cater to every palate.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Location & Accessibility
              </h3>
              <p className="text-gray-600">
                Strategically located with easy access to major attractions,
                shopping districts, and business hubs. Our concierge service is
                available 24/7 to ensure you make the most of your stay.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-lg">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <img
                    src={RoomImg1}
                    alt="Image 1"
                    className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
              <div className="aspect-square rounded-lg">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <img
                    src={RoomImg2}
                    alt="Image 1"
                    className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
              <div className="aspect-square rounded-lg">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <img
                    src={RoomImg3}
                    alt="Image 1"
                    className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
              <div className="aspect-square rounded-lg">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <img
                    src={RoomImg4}
                    alt="Image 1"
                    className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              24/7 Service
            </h4>
            <p className="text-gray-600">
              Round-the-clock customer service to cater to all your needs
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              Fine Dining
            </h4>
            <p className="text-gray-600">
              Multiple restaurants offering international and local cuisine
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              Luxury Spa
            </h4>
            <p className="text-gray-600">
              Rejuvenate yourself with our world-class spa treatments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
