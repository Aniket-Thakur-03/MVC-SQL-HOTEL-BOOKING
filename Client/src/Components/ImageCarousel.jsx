import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CirclePause, Play } from 'lucide-react';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // Change slide every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[500px] mb-8">
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button 
          onClick={goToPrevious}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={goToNext}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Images */}
      <div className="h-full overflow-hidden">
        {images.map((image, index) => (
          <img
            key={index}
            src={`http://localhost:8000${image}`}
            alt={`Slide ${index + 1}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Dots navigation */}
      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex items-center justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Play/Pause button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm hover:bg-black/70 transition-all"
      >
        {isPlaying ? <CirclePause /> : <Play />}
      </button>
    </div>
  );
};

export default ImageCarousel;