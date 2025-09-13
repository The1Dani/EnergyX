import React from "react";
import "./RecommendationsPage.css";

const RecommendationsPage = () => (
  <section id="recommendations" className="page-section py-5">
    <div className="container">
      <h2 className="section-title text-center">Recommendations</h2>

      <div className="recommendations-grid">
        <div className="alert-card">
          <h4 className="alert-title">
            <i className="bi bi-exclamation-triangle-fill text-danger"></i>
            Hîncești exceeded safe limits
          </h4>
          <p>
            Activate the Bozieni power station for 3 hours to reduce pressure on the grid.
          </p>
        </div>

        <div className="alert-card">
          <h4 className="alert-title">
            <i className="bi bi-activity text-warning"></i>
            Rising demand in Orhei
          </h4>
          <p>
            Consider enabling backup energy sources for this evening.
          </p>
        </div>

        <div className="alert-card">
          <h4 className="alert-title">
            <i className="bi bi-lightning-fill text-primary"></i>
            High load in Chișinău
          </h4>
          <p>
            Schedule demand response actions to balance peak hours.
          </p>
        </div>

        <div className="alert-card">
          <h4 className="alert-title">
            <i className="bi bi-sun-fill text-success"></i>
            Solar capacity available
          </h4>
          <p>
            Favor renewable integration in the grid during the next 3 sunny days.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default RecommendationsPage;
