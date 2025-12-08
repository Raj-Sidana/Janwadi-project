import React, { useState, useEffect } from "react";

const AutoSlider = () => {
  const images = [
    "/Bgimage.jpg",
    "/bi2.jpeg",
    "/bi3.jpeg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden shadow-lg">
      {/* Images */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index}`}
            className="w-full shrink-0 object-cover h-[300px] md:h-[500px]"
          />
        ))}
      </div>


      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
      <div id="slidingImageContent" className="h-auto md:h-140 w-full md:w-250 p-5 md:p-20 flex flex-col md:flex-row gap-5 justify-center md:justify-between items-center">
        <img className="h-20 w-20 md:h-40 md:w-40 object-scale-down" src="https://aniportalimages.s3.amazonaws.com/media/details/ANI-20250328044108.jpg" alt="" />
        <div className="flex items-center h-auto md:h-50 backdrop-blur-xs p-3 text-center">
          <h1 className="text-white font-semibold text-2xl md:text-6xl">Welcome To The Janwani Platform</h1>
        </div>
        <div></div>
      </div>
    </div>
   <h1 className="text-center font-semibold text-3xl mt-5">ABOUT JANWANI</h1>
   
    </>
  );
};

export default AutoSlider;
