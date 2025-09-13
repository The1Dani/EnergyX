import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer className="Footer">
    <div className="container">
      <div className="row">
        <div className="col-lg-4 mb-4">
          <h4 className="fw-bold">PremierEnergy Moldova</h4>
          <p>Soluții inovative pentru gestionarea inteligentă a energiei electrice.</p>
        </div>
        <div className="col-lg-4 mb-4">
          <h5>Link-uri rapide</h5>
          <ul className="list-unstyled">
            <li><a href="#home" className="text-decoration-none">Acasă</a></li>
            <li><a href="#search" className="text-decoration-none">Căutare localități</a></li>
            <li><a href="#predictions" className="text-decoration-none">Predictii</a></li>
            <li><a href="#recommendations" className="text-decoration-none">Recomandări</a></li>
          </ul>
        </div>
        <div className="col-lg-4">
          <h5>Contact</h5>
          <p><i className="fas fa-envelope me-2"></i> contact@premierenergy.md</p>
          <p><i className="fas fa-phone me-2"></i> +373 22 123 456</p>
        </div>
      </div>
      <hr className="mt-4 mb-4" />
      <div className="text-center">
        <p>&copy; 2023 PremierEnergy Moldova. Toate drepturile rezervate.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
