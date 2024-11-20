import from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import campusMarketImage from "../assets/campus_market.jpg";

const ComplexList = ({ complexes }) => {
  return (
    <div>
      <h2>Dining Complexes</h2>
      {complexes.map((complex, index) => (
        <Link
          to={`/complex/${complex._id}`}
          key={index}
          style={{ textDecoration: "none" }}>
          <Card style={{ width: "18rem", margin: "10px 0", cursor: "pointer" }}>
            <Card.Img variant="top" src={campusMarketImage} />
            <Card.Body>
              <Card.Title>{complex.name}</Card.Title>
            </Card.Body>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ComplexList;
