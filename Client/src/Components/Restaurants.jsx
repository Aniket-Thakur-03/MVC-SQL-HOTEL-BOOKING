import React from "react";
import RestaurantImage1 from "../assets/img/Restaurant/tamara-malaniy-gdiNvl_hvso-unsplash.jpg";
import RestaurantImage2 from "../assets/img/Restaurant/praveen-thirumurugan-nx05CDCrfzM-unsplash.jpg";
import RestaurantImage3 from "../assets/img/Restaurant/jnr-jose-I8Rf3tItuHE-unsplash.jpg";
function Restaurants() {
  return (
    <>
      <main className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-center text-3xl lg:text-4xl font-semibold text-primary mb-8">
            Exotic Restaurants
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Discover an unforgettable dining experience with flavors from around
            the world. Our curated selection of restaurants promises to elevate
            your taste journey with exquisite ambiance, skilled chefs, and
            flavors that linger in your memory.
          </p>

          <div className="grid gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Restaurant 1 */}
            <div className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
              <img
                src={RestaurantImage1}
                alt="Exotic Restaurant 1"
                className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-105"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Ocean Bliss
                </h2>
                <p className="text-gray-600">
                  Located by the serene beaches, Ocean Bliss offers fresh
                  seafood with a touch of exotic spices, providing a unique
                  oceanfront dining experience.
                </p>
              </div>
            </div>

            {/* Restaurant 2 */}
            <div className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
              <img
                src={RestaurantImage2}
                alt="Exotic Restaurant 2"
                className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-105"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Mountain Retreat
                </h2>
                <p className="text-gray-600">
                  Nestled in the mountains, Mountain Retreat specializes in
                  locally-sourced ingredients, offering authentic tastes of the
                  highlands with stunning panoramic views.
                </p>
              </div>
            </div>

            {/* Restaurant 3 */}
            <div className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
              <img
                src={RestaurantImage3}
                alt="Exotic Restaurant 3"
                className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-105"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Urban Garden
                </h2>
                <p className="text-gray-600">
                  Urban Garden combines greenery with gourmet cuisine in the
                  heart of the city. Perfect for those who seek a peaceful
                  escape without leaving urban life behind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Restaurants;
