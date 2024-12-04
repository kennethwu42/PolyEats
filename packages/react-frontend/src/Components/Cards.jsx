import React from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

function Cards({ image, title, link }) {
  return (
    <Link to={link} style={{ textDecoration: "none", color: "inherit" }}>
      <Card className="card">
        <Card.Img variant="top" src={image} />
        <Card.Body className="card-body">
          <Card.Title className="card-title">{title}</Card.Title>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default Cards;
