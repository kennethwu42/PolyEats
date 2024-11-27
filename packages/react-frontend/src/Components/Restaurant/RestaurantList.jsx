import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "react-bootstrap/Card";

const RestaurantList = ({ API_PREFIX, addAuthHeader }) => {
  const { complexId } = useParams();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch(`${API_PREFIX}/complexes/${complexId}/restaurants`, {
      headers: addAuthHeader()
    })
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => setRestaurants(json ? json.restaurants_list : []))
      .catch((error) => console.log(error));
  }, [complexId, API_PREFIX, addAuthHeader]);

  return (
    <div>
      <h2>Restaurants</h2>
      {restaurants.map((restaurant, index) => (
        <Link
          to={`/restaurant/${restaurant._id}`}
          key={index}
          style={{ textDecoration: "none" }}>
          <Card style={{ width: "18rem", margin: "10px 0", cursor: "pointer" }}>
            <Card.Img variant="top" src={restaurant.image} />
            <Card.Body>
              <Card.Title>{restaurant.name}</Card.Title>
            </Card.Body>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default RestaurantList;
