import React from "react";
import RoomImage1 from "../assets/img/rooms/1.png";
import RoomImage2 from "../assets/img/rooms/2.png";
import RoomImage3 from "../assets/img/rooms/3.png";
import RoomImage4 from "../assets/img/rooms/4.png";
import RoomImage5 from "../assets/img/rooms/5.png";
function RoomInfo() {
  return (
    <>
      <main className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-center text-3xl lg:text-4xl font-semibold text-primary mb-8">
            Luxurious Rooms
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Explore our luxurious rooms, each thoughtfully designed to provide
            you with ultimate comfort, style, and relaxation. From cozy suites
            to spacious family rooms, we have the perfect space to suit your
            needs and make your stay unforgettable.
          </p>

          <div className="grid gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
              <img
                src={RoomImage1}
                alt="Luxury Suite"
                className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-105"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Superior Room
                </h2>
                <p className="text-gray-600">
                  The epitome of elegance and comfort, our Luxury Suite offers a
                  spacious layout, king-sized bed, and breathtaking city views.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
              <img
                src={RoomImage2}
                alt="Family Room"
                className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-105"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Signature Room
                </h2>
                <p className="text-gray-600">
                  Ideal for families, this spacious room comes with two queen
                  beds, a cozy seating area, and plenty of room to relax.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
              <img
                src={RoomImage3}
                alt="Executive Suite"
                className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-105"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Deluxe Room
                </h2>
                <p className="text-gray-600">
                  Perfect for business travelers, the Executive Suite offers a
                  dedicated work area, high-speed internet, and modern decor.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
              <img
                src={RoomImage4}
                alt="Deluxe Room"
                className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-105"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Luxury Room
                </h2>
                <p className="text-gray-600">
                  Designed for luxury and relaxation, our Deluxe Room features a
                  king bed, beautiful furnishings, and a private balcony.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
              <img
                src={RoomImage5}
                alt="Standard Room"
                className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-105"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Luxury Suite
                </h2>
                <p className="text-gray-600">
                  Our Standard Room is comfortable and well-appointed, offering
                  all essential amenities for a relaxing stay at a great value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default RoomInfo;
