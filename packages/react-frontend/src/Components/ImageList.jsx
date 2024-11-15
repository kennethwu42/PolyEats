import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

function ImageList() {

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">Photo Album</h1>
      <Row>
        {photos.map((photo, index) => (
          <Col md={4} sm={6} xs={12} className="mb-4" key={index}>
            <Card>
              <Card.Img variant="top" src={photo.src} alt={photo.title} />
              <Card.Body>
                <Card.Title>{photo.title}</Card.Title>
                <Card.Text>{photo.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ImageList;