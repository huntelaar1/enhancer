import React, { useState, useEffect } from 'react';

import '../index.css'

import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';

import { useMutation } from '@apollo/client'
import {SAVE_ART } from '../utils/mutations';
import { saveArtIds, getSavedArtIds } from '../utils/localStorage';

import Auth from '../utils/auth';
import { FormRow } from 'react-bootstrap/Form';
import { CardBody, CardText, CardTitle } from 'react-bootstrap/Card';

const FindArt = () => {
const [searchedArt, setSearchedArt] = useState([]);

const [searchInput, setSearchInput] = useState('');

const [savedArtIds, setSavedArtIds] = useState(getSavedArtIds());

const [saveArt, { error }] = useMutation(SAVE_ART);

useEffect(() => {
    return() => savedArtIds(savedArtIds);
});

const handleNewForm = async (event) => {
    event.preventDefault();

    if (!searchInput) {
        return false;
    }

    try {
        const response = await fetch(
            // 'insert URL for MET Art API'
        );
        if (!response.ok) {
            throw new Error('Please try again');
        }

        const { items } = await response.json();

        const artData = items.map((book) => ({
            artId: art.id,
            artists: art.workInfo.artist || ['No artist to display'],
            title: art.workInfo.title,
            description: art.workInfo.description,
            image: art.workInfo.imageLinks?.thumbnail || '',
        }));

        setSearchedArt(artData);
        setSearchInput('');
    }   catch (err) {
        console.error(err);
    }
};

const handleSaveArt = async (artId) => {
    
    const artToSave = searchedArt.find((art) => art.artId === artId);

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
        return false;
    }

    try {
        const { data } = await saveArt({
            variables: { artData: { ...artToSave} },
        });
        console.log(savedArtIds);
        setSavedArtIds([...savedArtIds, artToSave.artId]);
    }   catch (err) {
        console.error(err);
    }
};

return (
    <>
    <Jumbotron fluid className="text-light bg-dark">
        <Container>
            <h1>Search for Art!</h1>
            <Form onSubmit={handleNewForm}>
                <Form.Row>
                    <Col xs={12} md={8}>
                        <Form.Control
                            name="searchInput"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            type="text"
                            size="lg"
                            placeholder="Find a masterpiece..."
                            />
                    </Col>
                    <Col xs={12} md={4}>
                        <Button type="submit" variant="success" size="lg">
                            Find Art
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
        </Container>
    </Jumbotron>
    <div className="bg"></div>
    <Container>
        <h2>
            {searchedArt.length
            ? `Viewing ${searchedArt.length} results:`
            : 'Search for art to view'}
        </h2>
        <CardColumns>
            {searchedArt.map((art) => {
                return (
                    <Card key={art.artId} border="dark">
                        {art.image ? (
                            <Card.Img
                                src={art.image}
                                alt={`The artwork ${art.title}`}
                                variant="top"
                            />
                        ) : null}
                        <Card.Body>
                            <Card.Title>{art.title}</Card.Title>
                            <p className="small">Artists: {art.artist}</p>
                            <Card.Text>{art.description}</Card.Text>
                            {Auth.loggedIn() && (
                                <Button
                                    disabled={savedArtIds?.some(
                                        (savedId) => savedId === art.artId
                                    )}
                                    className="btn-block btn-info"
                                    onClick={() => handleSaveArt(art.artId)}
                                    >
                                    {savedArtIds?.some((savedId) => savedId === art.artId)
                                        ? 'Art already saved!'
                                        : 'Save this Art!'}  
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                )
            })}
        </CardColumns>
    </Container>
    </>
);
};

export default FindArt;
