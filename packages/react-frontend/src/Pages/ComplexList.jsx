import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import campusMarketImage from "../assets/campus_market.jpg";

function ComplexListHeader() {
  return (
    <thead>
      <tr>
        <th>Complexes</th>
      </tr>
    </thead>
  );
}

function ComplexListBody(props) {
  const cards = props.complexData.map((row, index) => {
    return (
      <Card style={{ width: "18rem" }} key={index}>
        <Card.Img variant="top" src={campusMarketImage} />
        <Card.Body>
          <Card.Title>{row.name}</Card.Title>
        </Card.Body>
      </Card>
    );
  });
  return <tbody><tr><td>{cards}</td></tr></tbody>;
}

function ComplexList(props) {
  return (
    <table>
      <ComplexListHeader />
      <ComplexListBody 
        complexData={props.complexData}
      />
    </table>
  );
}

export default ComplexList;