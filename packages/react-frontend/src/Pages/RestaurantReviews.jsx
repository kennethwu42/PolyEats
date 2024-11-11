import React, { useState, useEffect } from "react";
import List from "../Components/CardList";
import "../App.scss";

function Complexes() {
  const [complexes, setComplexes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/complexes")
      .then((res) => res.json())
      .then((json) => setComplexes(json.complexes_list))
      .catch((error) => console.error("Error fetching complexes:", error));
  }, []);

  return (
    <div>
      <h1>Complexes</h1>
      <List props={complexes} />
    </div>
  );
}

export default Complexes;