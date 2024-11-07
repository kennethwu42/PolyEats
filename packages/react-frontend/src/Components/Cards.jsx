import React from 'react';
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

function Cards({ image, title, link }) {
  return (
    <Card style={{ width: "18rem", margin: "1rem" }}>
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default Cards;