import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';


import { 
  useMutation,
  useQuery
} from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { USER, USER_ME } from '../utils/queries';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {

  const [removeBook, { error, data2 }] = useMutation(REMOVE_BOOK, {
    refetchQueries: [USER_ME]
  });

  const { data, loading, error2 } = useQuery(USER_ME);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error2) {
    console.log(error2);
    return <div>Error! {error2.message}</div>;
  }

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await removeBook({
        variables: { userID: Auth.getProfile().data._id, bookId }
      });

      if (!response) {
        throw new Error('something went wrong!');
      }

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  const userData = data?.me

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData?.savedBooks?.length
            ? `Viewing ${userData?.savedBooks?.length} saved ${userData?.savedBooks?.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData?.savedBooks?.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
