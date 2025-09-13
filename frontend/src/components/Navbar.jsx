import React, { useState, forwardRef, useImperativeHandle } from "react";
import "./Navbar.css";

const Navbar = forwardRef(({ setCurrentPage, currentPage, role }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsOpen(false);
  };

  // Expose openMenu() for HomePage
  useImperativeHandle(ref, () => ({
    openMenu: () => setIsOpen(true),
  }));

  return (
    <>
      <nav className="Navbar sticky-top">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Brand */}
          <a className="navbar-brand" href="#" onClick={() => handleNavClick("home")}>
            <i className="bi bi-lightning-charge-fill me-2"></i>
            PremierEnergy
          </a>

          {/* Hamburger */}
          <button className="navbar-toggler" type="button" onClick={handleToggle}>
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}

      {/* Side menu */}
      <div className={`side-menu ${isOpen ? "open" : ""}`}>
        {/* Close button */}
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          &times;
        </button>

        <ul className="menu-list">
          <li onClick={() => handleNavClick("home")}>Home</li>
          <li onClick={() => handleNavClick("predictions")}>Predictions</li>
          <li onClick={() => handleNavClick("recommendations")}>Recommendations</li>

          {role === "consumer" && (
            <>
              <li onClick={() => handleNavClick("consumption")}>Hourly Consumption</li>
              <li onClick={() => handleNavClick("tariff")}>Tariff Calculator</li>
              <li onClick={() => handleNavClick("leaderboard")}>Leaderboard</li>
            </>
          )}

          {role === "provider" && (
            <>
              <li onClick={() => handleNavClick("provider-dashboard")}>Dashboard</li>
              <li onClick={() => handleNavClick("top-consumers")}>Top Consumers</li>
            </>
          )}
        </ul>
      </div>
    </>
  );
});

export default Navbar;
