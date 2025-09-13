import React, { useState } from 'react';

const PredictionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedTab, setSelectedTab] = useState('localitate');

  // Date simulate pentru grafic
  const historicalData = [220, 210, 190, 180, 175, 170, 185, 200, 230, 250, 270, 290, 
                          310, 320, 315, 305, 300, 320, 340, 360, 370, 355, 330, 310];
  
  const predictionData24h = [300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 490,
                            470, 450, 430, 410, 390, 370, 350, 330, 310, 290, 270, 250];
  
  const predictionData7d = [300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410,
                            420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530,
                            540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650,
                            660, 670, 680, 690, 700, 710, 720, 730, 740, 750, 760, 770];

  const labels24h = Array.from({length: 24}, (_, i) => `${i}:00`);
  const labels7d = Array.from({length: 7}, (_, i) => `Ziua ${i+1}`);

  // Funcție pentru a desena graficul simplificat
  const renderChart = () => {
    const data = timeRange === '24h' ? historicalData.concat(predictionData24h) : historicalData.concat(predictionData7d);
    const labels = timeRange === '24h' ? labels24h : labels7d;
    const maxValue = Math.max(...data);
    
    return (
      <div className="chart-container">
        <div className="position-relative h-100">
          {/* Axe și linii de background */}
          <div className="position-absolute w-100 h-100 d-flex flex-column justify-content-between">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="d-flex align-items-center" style={{ height: '20%' }}>
                <div className="text-muted me-2" style={{ width: '40px' }}>
                  {Math.round(maxValue * (4 - i) / 4)}
                </div>
                <div className="flex-grow-1 border-top"></div>
              </div>
            ))}
          </div>
          
          {/* Linia graficului */}
          <div className="position-absolute w-100 h-100 pt-4">
            <div className="position-relative h-100">
              {data.map((value, index) => (
                <div 
                  key={index}
                  className="position-absolute bg-primary rounded"
                  style={{
                    width: '4px',
                    height: `${(value / maxValue) * 80}%`,
                    left: `${(index / (data.length - 1)) * 100}%`,
                    bottom: '0',
                    transform: 'translateX(-50%)'
                  }}
                ></div>
              ))}
              
              {/* Linia limită maximă */}
              <div 
                className="position-absolute w-100 border-top border-danger"
                style={{
                  top: `${(1 - 400 / maxValue) * 80}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid py-4">
      <h1 className="text-center mb-4 display-5 fw-bold">Prognoze consum energetic</h1>
      
      <ul className="nav nav-tabs justify-content-center mb-3">
        <li className="nav-item">
          <button 
            className={`nav-link ${selectedTab === 'localitate' ? 'active' : ''}`}
            onClick={() => setSelectedTab('localitate')}
          >
            După localitate
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${selectedTab === 'tara' ? 'active' : ''}`}
            onClick={() => setSelectedTab('tara')}
          >
            Situația națională
          </button>
        </li>
      </ul>
      
      {selectedTab === 'localitate' && (
        <div className="row justify-content-center mb-4">
          <div className="col-md-8">
            <form>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control form-control-lg me-2"
                  placeholder="Introduceți numele localității..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button" className="btn btn-primary btn-lg">
                  Caută
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {selectedTab === 'tara' && (
        <div className="text-center mb-4">
          <h3>Prognoza consumului la nivel național</h3>
        </div>
      )}

      <div className="text-center mb-4">
        <div className="btn-group">
          <button 
            className={`btn ${timeRange === '24h' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setTimeRange('24h')}
          >
            24 Ore
          </button>
          <button 
            className={`btn ${timeRange === '7d' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setTimeRange('7d')}
          >
            7 Zile
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col">
          {renderChart()}
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="p-3 bg-light rounded">
            <h4>Analiza prognozei</h4>
            <p>
              {timeRange === '24h' 
                ? 'În următoarele 24 de ore se preconizează o creștere a consumului cu aproximativ 25%, depășind limita maximă recomandată între orele 10:00 și 16:00.'
                : 'În următoarea săptămână, consumul va avea o tendință de creștere constantă, depășind limita maximă începând cu ziua a 3-a.'}
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-3 bg-light rounded">
            <h4>Recomandări</h4>
            <p>
              {timeRange === '24h' 
                ? 'Se recomandă activarea centralei de rezervă între orele 09:00-17:00 și implementarea unor măsuri de reducere a consumului în sectorul industrial.'
                : 'Este necesară planificarea activării tuturor surselor de energie disponibile și notificarea consumatorilor majori să-și programeze activitățile intensive outside orele de vârf.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionsPage;