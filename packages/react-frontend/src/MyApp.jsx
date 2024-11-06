import React, { useState, useEffect } from "react";
import Table from './Table';
// import Card from './Components/Card';

function MyApp() {
  const [complexes, setComplexes] = useState([]);

  function fetchComplexes(){
    const promise = fetch("http://localhost:8000/complexes");
  }

  useEffect(() => {
    fetchComplexes()
      .then((res) => res.json())
      .then((json) => setComplexes(json))
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  return (
    <div className="container">
      <Table
        complexData={complexes}
      />
    </div>
  );
}
export default MyApp;
