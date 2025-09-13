import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import PredictionsPage from './components/PredictionsPage';
import RecommendationsPage from './components/RecommendationsPage';
import Footer from './components/Footer';
import AuthPage from './components/AuthPage';
import HourlyConsumption from './components/HourlyConsumption';
import TariffCalculator from './components/TariffCalculator';
import Leaderboard from './components/Leaderboard';
import Chatbot from './components/Chatbot';
import ProviderDashboard from "./components/ProviderDashboard";
import TopConsumers from "./components/TopConsumers";

function App() {
  const [currentPage, setCurrentPage] = useState('auth');
  const [role, setRole] = useState(null); // track Provider or Consumer

  const renderPage = () => {
    switch (currentPage) {
      case 'auth':
        return <AuthPage setCurrentPage={setCurrentPage} setRole={setRole} />;
      case 'home':
        return <HomePage />;
      case 'search':
        return <SearchPage />;
      case 'predictions':
        return <PredictionsPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'consumption':
        return <HourlyConsumption />;
      case 'tariff':
        return <TariffCalculator />;
      case 'leaderboard':
        return <Leaderboard />;
      case "provider-dashboard":
        return <ProviderDashboard setCurrentPage={setCurrentPage} />;
      case "top-consumers":
        return <TopConsumers />;
      

      default:
        return <HomePage />;
    }
  };

  return (
    <div>
      {/* Hide Navbar & Footer on Auth Page */}
      {currentPage !== 'auth' && (
        <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} role={role} />
      )}

      <main>{renderPage()}</main>

      {currentPage !== 'auth' && <Footer />}

      {/* Floating Chatbot only for consumers */}
      {role === 'consumer' && currentPage !== 'auth' && <Chatbot />}
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
