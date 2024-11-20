import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import accountService from "../express-backend/services/account-service.js";
import complexService from "../express-backend/services/complex-service.js";
import restaurantService from "../express-backend/services/restaurant-service.js";
// import reviewService from "../express-backend/services/review-service.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose.connect(MONGO_CONNECTION_STRING).catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//get list of complexes
app.get("/complexes", (req, res) => {
  const name = req.query.name;

  complexService
    .getComplexes(name)
    .then((complexes) => {
      res.status(200).send({ complexes_list: complexes });
    })
    .catch((error) => {
      res.status(500).send({ error: "Error fetching complexes" });
    });
});

//get all restaurants within a specific complex (with filters/sorting if desired)
app.get("/complexes/:complexId/restaurants", (req, res) => {
  const complexId = req.params.complexId;
  const {
    name,
    minRating,
    cuisine,
    delivery,
    price,
    accepted_payments,
    nutrition_types,
    hours,
    sortField,
    sortOrder
  } = req.query;

  const filters = {};
  if (name) {
    //e.g. ?name=Hearth or ?name=hearth (not case sensitive)
    filters.name = name;
  }
  if (minRating) {
    //e.g. ?minRating=4
    filters.avg_rating = parseFloat(minRating);
  }
  if (cuisine) {
    //e.g. ?cuisine=Mexican or ?name=mexican (not case sensitive)
    filters.cuisine = cuisine;
  }
  if (delivery) {
    //e.g. ?delivery=true
    filters.delivery = delivery === "true";
  }
  if (price) {
    //e.g. ?price=$
    filters.price = price;
  }
  if (accepted_payments) {
    //JSON object, e.g., ?accepted_payments={"PolyCard": true, "CreditDebit": true}
    try {
      filters.accepted_payments = JSON.parse(accepted_payments);
    } catch (error) {
      return res
        .status(400)
        .send({ error: "Invalid format for accepted_payments" });
    }
  }
  if (nutrition_types) {
    //JSON object, e.g., ?nutrition_types={"Vegan": true, "GlutenFree": true}
    try {
      filters.nutrition_types = JSON.parse(nutrition_types);
    } catch (error) {
      return res
        .status(400)
        .send({ error: "Invalid format for nutrition_types" });
    }
  }
  if (hours) {
    //JSON object, e.g., ?hours={"M": true}
    try {
      filters.hours = JSON.parse(hours);
    } catch (error) {
      return res.status(400).send({ error: "Invalid format for hours" });
    }
  }

  restaurantService
    .getRestaurants(filters, sortField, sortOrder || "asc", complexId)
    .then((restaurants) => {
      res.status(200).send({ restaurants_list: restaurants });
    })
    .catch((error) => {
      res
        .status(500)
        .send({
          error: "Error fetching/filtering/sorting restaurants in complex"
        });
    });
});
/* For sorting:
  ?sortField=name&sortOrder=asc --> Name A-Z
  ?sortField=name&sortOrder=desc --> Name Z-A
  ?sortField=avg_rating&sortOrder=desc --> Average Rating high to low
  ?sortField=avg_rating&sortOrder=asc --> Average Rating low to high
  ?sortField=price&sortOrder=asc --> price low to high
  ?sortField=price&sortOrder=desc --> price high to low
  */


