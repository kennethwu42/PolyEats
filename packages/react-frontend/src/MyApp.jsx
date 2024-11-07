import React, { useState, useEffect } from "react";
import ComplexList from './Pages/ComplexList';
import "./App.scss";

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
      <ComplexList
        complexData={complexes}
      />
    </div>
  );
}
export default MyApp;
