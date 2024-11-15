import React from 'react';
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

function Cards({ color, title, link }) {
  return (
    <Link to={link} style={{ textDecoration: "none", color: "inherit" }}>
      <Card style={{ width: "18rem", margin: "1rem" }}>
        <div style={{ height: "200px", backgroundColor: color }}></div>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default Cards;