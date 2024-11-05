import React from 'react';

function Card(props) {
  return (
    <div className="card-container">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Flag_of_Libya_%281977%E2%80%932011%29.svg/300px-Flag_of_Libya_%281977%E2%80%932011%29.svg.png"
            alt="Card Image" 
            className="card-img"/>
      <h1 className="card-title">Complex</h1>
    </div>
  );
}

export default Card;