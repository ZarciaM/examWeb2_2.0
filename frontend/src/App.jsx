import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';  // Navbar importée
import Possessions from './components/Possessions';     // Composant Possessions
// import PatrimoineCalculator from './components/CalculatePatrimoine'; // Composant pour calculer le patrimoine
import PatrimoineChart from './components/PatrimoineChart'; // Composant pour afficher le graphique

const App = () => {
    return (
        <Router>
            <NavigationBar />
            <Routes>
                <Route path="/possessions" element={<Possessions />} />
                {/* <Route path="/Calculate-patrimoine" element={<PatrimoineCalculator />} /> */}
                <Route path="/patrimoine-chart" element={<PatrimoineChart />} />
                <Route path="/" element={<Possessions />} />  {/* Page par défaut */}
            </Routes>
        </Router>
    );
};

export default App;
