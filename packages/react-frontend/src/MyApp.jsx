import React, { useState, useEffect } from "react";
import Table from './Table';
// import Card from './Components/Card';

function MyApp() {
  const [complexes, setComplexes] = useState([]);

  function fetchComplexes(){
    return fetch("http://localhost:8000/complexes");
  }

  useEffect(() => {
    fetchComplexes()
      .then((res) => res.json())
      .then((json) => setComplexes(json.complexes_list))
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
