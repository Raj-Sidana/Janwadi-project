import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex items-center justify-between w-screen h-30 bg-white px-3 py-1 border-b md:px-7 ">
      <div className="w-20 h-30 flex items-center font-bold text-gray-900">
        <img src="/public/janwani.png" className="h-40 w-40 md:h-60 md:w-60 object-cover rounded-full"></img>
        <h2 className="text-2xl ml-1 ">Janwani <p className="text-xs">(For Solving Civic Issues)</p></h2>
      </div>
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-25 text-gray-900 font-semibold text-7xs">
        <Link to='/'>Home</Link>
        <Link to='/About'>About</Link>
        <Link to='/ProblemStatus'>Problem Status</Link>
        <Link to='/RegisterProblem'>Register Problem</Link>
        <Link to='/Contact'>Contact</Link>
        {/* <span className="cursor-pointer">Home</span>
        <span className="cursor-pointer">About</span>
        <span className="cursor-pointer">Problem Status</span>
        <span className="cursor-pointer">Register Problem</span>
        <span className="cursor-pointer">Contact</span> */}
        <div className="flex items-center gap-2">
          {/* <p className="bg-green-600 text-white font-semibold py-1 px-3 rounded-2xl">Login</p> */}
          <Link to='/SignIn'><p className="bg-indigo-900 text-white font-semibold py-2 px-4 rounded-xl">Sign in</p></Link>
        
          {/* <p className="text-white font-semibold py-1 px-3 rounded-2xl bg-orange-400">Register</p> */}
         
        </div>
      </div>
      {/* Mobile Hamburger Menu */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-gray-900 focus:outline-none">
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`block w-5 h-0.5 bg-gray-900 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
            <span className={`block w-5 h-0.5 bg-gray-900 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-5 h-0.5 bg-gray-900 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
          </div>
        </button>
        {isMenuOpen && (
          <div className="absolute top-30 left-0 w-full bg-white border-b shadow-lg z-10">
            <div className="flex flex-col items-center gap-4 py-4 text-gray-900 font-semibold">
              {/* <span className="cursor-pointer">Home</span> */}
              <Link to='/'><span className="cursor-pointer">Home</span></Link>
              <span className="cursor-pointer">About</span>
              <span className="cursor-pointer">Problem Status</span>
              <span className="cursor-pointer">Register Problem</span>
              <span className="cursor-pointer">Contact</span>
              <div className="flex items-center gap-2">
                {/* <p className="bg-green-600 text-white font-semibold py-1 px-3 rounded-2xl">Login</p> */}
                <Link to='/SignIn'><p className="bg-green-600 text-white font-semibold py-1 px-3 rounded-2xl">Login</p></Link>
                
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
