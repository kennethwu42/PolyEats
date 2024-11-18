import React from 'react';
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

function Cards({ color, title, link }) {
  return (
    <Link to={link} style={{ textDecoration: "none", color: "inherit" }}>
      <Card className="card">
        <div className="card-img" style={{ height: "200px", backgroundColor: color }}></div>
        <Card.Body>
          <Card.Title className="card-title">{title}</Card.Title>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default Cards;