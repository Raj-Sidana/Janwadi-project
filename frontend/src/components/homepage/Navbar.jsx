import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem("token"));
  });
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const [userInitial, setUserInitial] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      const storedUser = localStorage.getItem("user");
      const parsed = storedUser ? JSON.parse(storedUser) : null;
      return parsed?.name ? parsed.name.charAt(0).toUpperCase() : "";
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      return "";
    }
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const syncAuthState = () => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("token");
      setIsAuthenticated(Boolean(token));

      try {
        const storedUser = localStorage.getItem("user");
        const parsed = storedUser ? JSON.parse(storedUser) : null;
        setUserInitial(parsed?.name ? parsed.name.charAt(0).toUpperCase() : "");
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        setUserInitial("");
      }
    };

    syncAuthState();
    window.addEventListener("authChange", syncAuthState);
    window.addEventListener("storage", syncAuthState);

    const handleOutsideClick = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("authChange", syncAuthState);
      window.removeEventListener("storage", syncAuthState);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsProfileMenuOpen(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/home", { replace: true });
  };

  const ProfileBadge = () => (
    <div className="relative" ref={profileMenuRef}>
      <button
        onClick={() => setIsProfileMenuOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full bg-indigo-900 text-white flex items-center justify-center font-semibold uppercase focus:outline-none"
        title="View profile"
      >
        {userInitial || "U"}
      </button>
      {isProfileMenuOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg bg-white shadow-lg border border-gray-100 z-20">
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 no-underline"
            onClick={() => setIsProfileMenuOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-between w-screen h-30 bg-white px-3 py-1 border-b md:px-7 ">
      <Link to='/home' className="w-20 h-30 flex items-center font-bold text-gray-900 cursor-pointer hover:opacity-80 transition-opacity no-underline">
        <img src="/Janwani.png" alt="Janwani Logo" className="h-40 w-40 md:h-60 md:w-60 object-cover rounded-full"></img>
        <h2 className="text-2xl ml-1 ">Janwani <p className="text-xs">(For Solving Civic Issues)</p></h2>
      </Link>
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-25 text-gray-900 font-semibold text-7xs">
        <Link to='/home' className="hover:text-indigo-900 transition-colors cursor-pointer no-underline block py-2 px-2">Home</Link>
        <Link to='/About' className="hover:text-indigo-900 transition-colors cursor-pointer no-underline">About</Link>
        <Link to='/ProblemStatus' className="hover:text-indigo-900 transition-colors cursor-pointer no-underline">Problem Status</Link>
        <Link to='/RegisterProblem' className="hover:text-indigo-900 transition-colors cursor-pointer no-underline">Register Problem</Link>
        <Link to='/Contact' className="hover:text-indigo-900 transition-colors cursor-pointer no-underline">Contact</Link>
        {/* <span className="cursor-pointer">Home</span>
        <span className="cursor-pointer">About</span>
        <span className="cursor-pointer">Problem Status</span>
        <span className="cursor-pointer">Register Problem</span>
        <span className="cursor-pointer">Contact</span> */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <ProfileBadge />
          ) : (
          <Link to='/SignIn'><p className="bg-indigo-900 text-white font-semibold py-2 px-4 rounded-xl">Sign in</p></Link>
          )}
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
              <Link to='/home' onClick={() => setIsMenuOpen(false)} className="no-underline block w-full text-center py-2"><span className="cursor-pointer">Home</span></Link>
              <span className="cursor-pointer">About</span>
              <Link to='/ProblemStatus' onClick={() => setIsMenuOpen(false)}><span className="cursor-pointer">Problem Status</span></Link>
              <Link to='/RegisterProblem' onClick={() => setIsMenuOpen(false)}><span className="cursor-pointer">Register Problem</span></Link>

              <span className="cursor-pointer">Contact</span>
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <ProfileBadge />
                ) : (
                <Link to='/SignIn'><p className="bg-green-600 text-white font-semibold py-1 px-3 rounded-2xl">Login</p></Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
