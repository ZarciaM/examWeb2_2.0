import React, { Component } from 'react';
import { Button, Table, Form, Container } from 'react-bootstrap';
import './Possessions.css';  // Importation du fichier CSS personnalisé

class Possessions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            possessions: [],
            newPossession: { 
                libelle: '', 
                valeur: 0, 
                dateDebut: '', 
                dateFin: '', 
                tauxAmortissement: 0 
            },
            isEditing: false,
            currentPossession: { 
                libelle: '', 
                valeur: 0, 
                dateDebut: '', 
                dateFin: '', 
                tauxAmortissement: 0 
            }
        };
    }

    componentDidMount() {
        this.fetchPossessions();
    }

    // Récupérer la liste des possessions
    fetchPossessions = () => {
        fetch('/api/possessions')
            .then(res => res.json())
            .then(possessions => this.setState({ possessions }))
            .catch(error => console.error('Error fetching possessions:', error));
    };

    // Gérer les changements dans le formulaire
    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            [prevState.isEditing ? 'currentPossession' : 'newPossession']: {
                ...prevState[prevState.isEditing ? 'currentPossession' : 'newPossession'],
                [name]: value
            }
        }));
    };

    // Ajouter une nouvelle possession
    handleAddPossession = () => {
        const { newPossession } = this.state;
    
        fetch('/api/possessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPossession),
        })
        .then(res => res.json())
        .then(possession => {
            this.setState(prevState => ({
                possessions: [...prevState.possessions, possession],
                newPossession: { libelle: '', valeur: 0, dateDebut: '', dateFin: '', tauxAmortissement: 0 },
            }));
        })
        .catch(error => {
            console.error('Error adding possession:', error.message);
        });
    };

    // Préparer l'édition d'une possession
    handleEditPossession = (possession) => {
        this.setState({ 
            isEditing: true, 
            currentPossession: { ...possession },
            originalLibelle: possession.libelle
        });
    };

    // Mettre à jour une possession
    handleUpdatePossession = () => {
        const { currentPossession, originalLibelle } = this.state;
    
        fetch(`/api/possessions/${encodeURIComponent(originalLibelle)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentPossession),
        })
        .then(res => res.json())
        .then((updatedPossession) => {
            this.setState(prevState => ({
                possessions: prevState.possessions.map(possession =>
                    possession.libelle === updatedPossession.libelle ? updatedPossession : possession
                ),
                isEditing: false,
                currentPossession: { libelle: '', valeur: '', dateDebut: '', dateFin: '', tauxAmortissement: '' },
                originalLibelle: ''
            }));
        })
        .catch(error => console.error('Error updating possession:', error));
    };

    // Supprimer une possession
    handleDeletePossession = (libelle) => {
        fetch(`/api/possessions/${libelle}`, {
            method: 'DELETE',
        })
            .then(() => {
                this.setState(prevState => ({
                    possessions: prevState.possessions.filter(possession => possession.libelle !== libelle),
                }));
            })
            .catch(error => console.error('Error deleting possession:', error));
    };

    // Clôturer une possession
    handleClosePossession = (libelle) => {
        fetch(`/api/possessions/close/${encodeURIComponent(libelle)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then((closedPossession) => {
            this.setState(prevState => ({
                possessions: prevState.possessions.map(possession =>
                    possession.libelle === closedPossession.libelle ? closedPossession : possession
                ),
            }));
        })
        .catch(error => console.error('Error closing possession:', error));
    };

    render() {
        const { possessions, newPossession, currentPossession, isEditing } = this.state;

        return (
            <Container className="elegant-theme">
                <h2 className="title">Possessions Management</h2>
                <Table bordered hover className="elegant-table">
                    <thead>
                        <tr>
                            <th>Libelle</th>
                            <th>Valeur</th>
                            <th>Date Debut</th>
                            <th>Date Fin</th>
                            <th>Taux Amortissement</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {possessions.map(possession => (
                            <tr key={possession.libelle}>
                                <td>{possession.libelle}</td>
                                <td>{possession.valeur}</td>
                                <td>{possession.dateDebut}</td>
                                <td>{possession.dateFin || 'En cours'}</td>
                                <td>{possession.tauxAmortissement}</td>
                                <td>
                                    <Button variant="outline-primary" className="elegant-button" onClick={() => this.handleEditPossession(possession)}>Edit</Button>{' '}
                                    <Button variant="outline-danger" className="elegant-button" onClick={() => this.handleDeletePossession(possession.libelle)}>Delete</Button>{' '}
                                    <Button variant="outline-success" className="elegant-button" onClick={() => this.handleClosePossession(possession.libelle)}>Clôturer</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Form className="elegant-form">
                    <h3>{isEditing ? 'Edit Possession' : 'Add New Possession'}</h3>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            name="libelle"
                            value={isEditing ? currentPossession.libelle : newPossession.libelle}
                            placeholder="Libelle"
                            onChange={this.handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            type="number"
                            name="valeur"
                            value={isEditing ? currentPossession.valeur : newPossession.valeur}
                            placeholder="Valeur"
                            onChange={this.handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            type="date"
                            name="dateDebut"
                            value={isEditing ? currentPossession.dateDebut : newPossession.dateDebut}
                            placeholder="Date Debut"
                            onChange={this.handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            type="date"
                            name="dateFin"
                            value={isEditing ? currentPossession.dateFin : newPossession.dateFin}
                            placeholder="Date Fin"
                            onChange={this.handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            type="number"
                            name="tauxAmortissement"
                            value={isEditing ? currentPossession.tauxAmortissement : newPossession.tauxAmortissement}
                            placeholder="Taux Amortissement"
                            onChange={this.handleInputChange}
                        />
                    </Form.Group>
                    <Button variant="primary" className="elegant-button" onClick={isEditing ? this.handleUpdatePossession : this.handleAddPossession}>
                        {isEditing ? 'Update Possession' : 'Add Possession'}
                    </Button>
                </Form>
            </Container>
        );
    }
}

export default Possessions;
