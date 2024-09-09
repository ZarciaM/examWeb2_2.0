import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NavigationBar.css'; // Crée ce fichier pour styliser les couleurs

const NavigationBar = () => {
    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand href="/" className="custom-brand">Gestion du Patrimoine</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/possessions" className="custom-link">
                            Possessions
                        </Nav.Link>
                        <Nav.Link as={Link} to="/patrimoine-chart" className="custom-link">
                            Patrimoine Chart
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
