import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

const photos = [
  "https://storage.googleapis.com/polyeats/julians_coffee.jpeg",
  "https://storage.googleapis.com/polyeats/julians_outside.jpg",
  "https://storage.googleapis.com/polyeats/julians_sammy.jpeg"
];

function ImageList({ API_PREFIX, addAuthHeader }) {
  return (
    <div className="card-container">
      <h1 style={{ textAlign: "center" }}>Photo Album</h1>
      <Row>
        {photos.map((photo, index) => (
          <Col
            lg={4}
            md={6}
            sm={12}
            className="d-flex justify-content-center mb-4"
            key={index}>
            <Card className="card">
              <Card.Img
                variant="top"
                src={photos[index % photos.length]}
                alt={photo.title}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ImageList;
