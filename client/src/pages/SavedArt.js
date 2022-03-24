import React from 'react';
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_ART } from '../utils/mutations';
import { removeArtId } from '../utils/localStorage';

import Auth from '../utils/auth';

const SavedArt = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeArt, { error }] = useMutation(REMOVE_ART);

  const userData = data?.me || {};

  // create function that accepts the art's mongo _id value as param and deletes the art from the database
  const handleDeleteArt = async (artId) => {
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeArt({
        variables: { artId },
      });

      // upon success, remove art's id from localStorage
      removeArtId(artId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing {userData.username}'s Art!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedArt?.length
            ? `Viewing ${userData.savedArt.length} saved ${
                userData.savedArt.length === 1 ? 'art' : 'art'
              }:`
            : 'You have no saved art!'}
        </h2>
        <CardColumns>
          {userData.savedArt?.map((art) => {
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
                  <p className="small">Artists: {art.artists}</p>
                  <Card.Text>{art.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteArt(art.artId)}
                  >
                    Delete this Art!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedArt;
