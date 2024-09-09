import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const PatrimoineChart = () => {
  const [possessions, setPossessions] = useState([]);
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [chartData, setChartData] = useState(null);
  const [specificDate, setSpecificDate] = useState('');
  const [patrimoineAtSpecificDate, setPatrimoineAtSpecificDate] = useState(null);

  useEffect(() => {
    fetch('/api/possessions')
      .then(response => response.json())
      .then(data => {
        setPossessions(data);
      })
      .catch(error => console.error('Error fetching possessions:', error));
  }, []);

  const calculateValeurPatrimoineOverTime = (startDate, endDate) => {
    const filteredPossessions = possessions.filter((possession) => {
      const possessionStart = new Date(possession.dateDebut);
      const possessionEnd = possession.dateFin ? new Date(possession.dateFin) : new Date();
      return possessionStart <= endDate && possessionEnd >= startDate;
    });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const numIntervals = 8;
    const intervalSize = (end - start) / numIntervals;
    const valuesOverTime = [];

    for (let i = 0; i <= numIntervals; i++) {
      let date = new Date(start.getTime() + i * intervalSize);
      let totalValeur = 0;

      filteredPossessions.forEach(possession => {
        const dateDebutPossession = new Date(possession.dateDebut);
        const dateFinPossession = possession.dateFin ? new Date(possession.dateFin) : null;
        const tauxAmortissement = possession.tauxAmortissement;
        const valeurInitiale = possession.valeur;

        if (date >= dateDebutPossession && (!dateFinPossession || date <= dateFinPossession)) {
          const yearsDiff = (date - dateDebutPossession) / (1000 * 60 * 60 * 24 * 365);
          const valeurAmortie = valeurInitiale * Math.pow((1 - tauxAmortissement / 100), yearsDiff);
          totalValeur += Math.max(0, valeurAmortie);
        }
      });

      valuesOverTime.push({
        date: date.toISOString().split('T')[0], // Date formatée
        valeur: totalValeur.toFixed(2),
      });
    }

    return valuesOverTime;
  };

  const handleCalculatePatrimoine = () => {
    const values = calculateValeurPatrimoineOverTime(dateDebut, dateFin);
    const labels = values.map(v => v.date);
    const valeurs = values.map(v => v.valeur);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Valeur du Patrimoine (€)',
          data: valeurs,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
        },
      ],
    });
  };

  const handleCheckSpecificDate = () => {
    if (!specificDate) {
      alert('Veuillez entrer une date.');
      return;
    }
  
    const date = new Date(specificDate);
    let totalValeur = 0;
  
    possessions.forEach(possession => {
      const dateDebutPossession = new Date(possession.dateDebut);
      const dateFinPossession = possession.dateFin ? new Date(possession.dateFin) : new Date();
      const tauxAmortissement = possession.tauxAmortissement;
      const valeurInitiale = possession.valeur;
  
      // Vérifier si la date est dans la plage de la possession
      if (date >= dateDebutPossession && date <= dateFinPossession) {
        const yearsDiff = (date - dateDebutPossession) / (1000 * 60 * 60 * 24 * 365);
        const valeurAmortie = valeurInitiale * Math.pow((1 - tauxAmortissement / 100), yearsDiff);
        totalValeur += Math.max(0, valeurAmortie);
      }
    });
  
    setPatrimoineAtSpecificDate(totalValeur.toFixed(2));
  };
  

  return (
    <Container className="mt-4">
      <h2>Évolution du Patrimoine</h2>
      <Form>
        <Form.Group controlId="dateDebut">
          <Form.Label>Date de Début</Form.Label>
          <DatePicker
            selected={dateDebut}
            onChange={(date) => setDateDebut(date)}
            className="form-control"
          />
        </Form.Group>
        <Form.Group controlId="dateFin" className="mt-3">
          <Form.Label>Date de Fin</Form.Label>
          <DatePicker
            selected={dateFin}
            onChange={(date) => setDateFin(date)}
            className="form-control"
          />
        </Form.Group>
        <Button className="mt-3" onClick={handleCalculatePatrimoine}>
          Afficher l'Évolution
        </Button>
      </Form>

      {chartData && (
        <div className="mt-4">
          <Line data={chartData} />
        </div>
      )}

      <Row className="mt-4">
        <Col md={6}>
          <Form.Group controlId="specificDate">
            <Form.Label>Date Spécifique</Form.Label>
            <Form.Control
              type="date"
              value={specificDate}
              onChange={(e) => setSpecificDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6} className="d-flex align-items-end">
          <Button onClick={handleCheckSpecificDate}>Afficher la Valeur à la Date</Button>
        </Col>
      </Row>

      {patrimoineAtSpecificDate !== null && (
        <div className="mt-3">
          <h4>Valeur du Patrimoine à la Date Spécifique : {patrimoineAtSpecificDate} €</h4>
        </div>
      )}
    </Container>
  );
};

export default PatrimoineChart;
