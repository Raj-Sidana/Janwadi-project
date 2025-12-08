import React from "react";

const FirstContainer = () => {
  return (
    <div className="w-full max-w-7xl h-auto md:h-100 bg-gray-100 rounded-3xl flex flex-col md:flex-row">
      <div className="w-full md:w-3 h-2 md:h-100 bg-indigo-900 rounded-t-3xl md:rounded-l-3xl md:rounded-t-none"></div>
      <div className="w-full md:w-240 p-5">
        <h1 className="text-2xl md:text-3xl text-black font-semibold">
          About Janwani: The Voice of the Citizen
        </h1>
        <br />
        <p className="text-gray-600 font-semibold text-lg md:text-xl">
          Janwani (Citizen's Voice) is a revolutionary digital platform launched
          by the Government of India to foster transparent, accountable, and
          responsive governance. Our mission is to create a seamless, direct
          channel between every citizen and the relevant civic authorities for
          the prompt identification and resolution of local issues.
        </p>
        <br />
        <p className="text-gray-600 font-semibold text-lg md:text-xl">
          Janvaani is more than just a reporting tool; it is our commitment to
          making digital governance accessible, interactive, and ultimately,
          effective. Join us in building a better, cleaner, and more efficient
          India.
        </p>
        <br />

      </div>
      <div className="w-full md:w-100 h-60 md:h-90 p-5 md:p-10 flex items-center justify-center">
        <img
          className="w-full max-w-80 h-40 md:h-60 object-cover rounded-2xl"
          src="https://www.hindustantimes.com/ht-img/img/2024/06/29/1600x900/Commuters-wade-through-water-on-a-service-road-on-_1719684509867.jpg"
          alt=""
        />
      </div>

    </div>
  );
};

export default FirstContainer;
