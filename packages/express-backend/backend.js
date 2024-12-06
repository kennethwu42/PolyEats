import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import dotenv from "dotenv";
import complexService from "./services/complex-service.js";
import restaurantService from "./services/restaurant-service.js";
import { authenticateUser, registerUser, loginUser } from "./auth.js";
import authRoutes from "./auth.js";
import accountService from "./services/account-service.js";
import reviewService from "./services/review-service.js";

//load environment variables
dotenv.config();

//destructure connection string from environment variables
const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
//connect to MongoDB using the connection string
mongoose.connect(MONGO_CONNECTION_STRING).catch((error) => console.log(error));

//create Express application instance
const app = express();
//configure CORS to allow requests from the specified origin and methods
app.use(
  cors({
    origin: "https://black-meadow-0048ebf1e.4.azurestaticapps.net",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With"
    ]
  })
);

//enable CORS pre-flight for all routes
app.options("*", cors());
//parse incoming JSON requests
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("REST API is listening.");
});

//configure multer storage
const storage = multer.memoryStorage(); //store files in memory
const upload = multer({ storage });

//register auth routes
app.use("/auth", authRoutes);

//default route
app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to PolyEats!" });
});

//user signup and login route
app.post("/signup", registerUser);
app.post("/login", loginUser);

//post a review for a specific restaurant
app.post(
  "/review",
  authenticateUser,
  upload.array("pictures", 10), //accept up to 10 images
  async (req, res) => {
    try {
      const { item, review, rating, restaurant } = req.body;
      const userId = req.user._id;

      //use helper function to handle review creation and picture uploads
      const newReview = await reviewService.postReview({
        item,
        review,
        rating,
        restaurant,
        author: userId,
        pictures: req.files //pass the files directly to the helper
      });

      res.status(201).send(newReview);
    } catch (error) {
      console.error("Error posting review:", error);
      res.status(500).send({ error: "Error posting review" });
    }
  }
);

//delete a review
app.delete("/review/:reviewId", authenticateUser, async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  try {
    //use helper function to handle review deletion and picture cleanup
    await reviewService.deleteReview(reviewId, userId);

    res
      .status(200)
      .send({ message: "Review and associated pictures deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).send({ error: "Error deleting review" });
  }
});

//upload or update profile picture
app.post(
  "/account/profile-pic",
  authenticateUser,
  upload.single("profile_pic"),
  async (req, res) => {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).send({ error: "No file uploaded" });
    }

    console.log("Uploaded file:", req.file);

    try {
      //use the helper function to handle file upload and database update
      const updatedAccount = await accountService.updateProfilePicture(
        userId,
        req.file
      );

      res.status(200).send({
        message: "Profile picture updated successfully",
        profile_pic: updatedAccount.profile_pic
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).send({ error: "Error updating profile picture" });
    }
  }
);

//delete profile picture
app.post("/account/profile-pic/remove", authenticateUser, async (req, res) => {
  const userId = req.user._id;

  try {
    //use helper function to handle profile picture deletion
    const updatedAccount = await accountService.removeProfilePicture(userId);
    res.status(200).send({
      message: "Profile picture removed successfully",
      profile_pic: updatedAccount.profile_pic
    });
  } catch (error) {
    console.error("Error removing profile picture:", error);
    res.status(500).send({ error: "Error removing profile picture" });
  }
});

//get account details
app.get("/account/details", authenticateUser, (req, res) => {
  //use helper function to return account details of logged in user
  accountService
    .getAccountDetails(req.user._id)
    .then((account) => res.status(200).send({ account }))
    .catch((error) =>
      res.status(500).send({ error: "Error fetching account details" })
    );
});

//get reviews given by the account
app.get("/account/reviews", authenticateUser, (req, res) => {
  //use helper function to return reviews of logged in user
  accountService
    .getAccountReviews(req.user._id)
    .then((reviews) => res.status(200).send({ reviews }))
    .catch((error) =>
      res.status(500).send({ error: "Error fetching reviews" })
    );
});

//get favorite restaurants for the account
app.get("/account/favorites", authenticateUser, (req, res) => {
  //use helper function to get favorite restaurants of logged in user
  accountService
    .getFavoriteRestaurants(req.user._id)
    .then((favorites) => res.status(200).send({ favorites }))
    .catch((error) =>
      res.status(500).send({ error: "Error fetching favorite restaurants" })
    );
});

//add a restaurant to favorites
app.post("/account/favorites/:restaurantId", authenticateUser, (req, res) => {
  //use helper function to add favorite restaurant to logged in user
  accountService
    .addFavoriteRestaurant(req.user._id, req.params.restaurantId)
    .then((account) =>
      res
        .status(201)
        .send({ message: "Restaurant added to favorites", account })
    )
    .catch((error) =>
      res.status(500).send({ error: "Error adding restaurant to favorites" })
    );
});

//remove a restaurant from favorites
app.delete("/account/favorites/:restaurantId", authenticateUser, (req, res) => {
  //use helper function to remove favorite restaurant of logged in user
  accountService
    .removeFavoriteRestaurant(req.user._id, req.params.restaurantId)
    .then((account) =>
      res
        .status(204)
        .send({ message: "Restaurant removed from favorites", account })
    )
    .catch((error) =>
      res
        .status(500)
        .send({ error: "Error removing restaurant from favorites" })
    );
});

//delete account route
app.delete("/account/delete", authenticateUser, (req, res) => {
  //use helper function to delete account of logged in user
  accountService
    .deleteAccount(req.user._id)
    .then((response) => res.status(204).send(response))
    .catch((error) =>
      res.status(500).send({ error: "Error deleting account" })
    );
});

//get list of complexes
app.get("/complexes", authenticateUser, (req, res) => {
  const name = req.query.name;
  //use helper function to get all complexes or a specific complex
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
app.get("/complexes/:complexId/restaurants", authenticateUser, (req, res) => {
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

  //use helper function to get all restaurants that satisfy filters and sorting
  restaurantService
    .getRestaurants(filters, sortField, sortOrder || "asc", complexId)
    .then((restaurants) => {
      res.status(200).send({ restaurants_list: restaurants });
    })
    .catch((error) => {
      res.status(500).send({
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

//get specific restaurant information by id (with reviews)
app.get("/restaurant/:id", authenticateUser, (req, res) => {
  const restaurantId = req.params.id;

  //use helped function to fetch restaurant details
  restaurantService
    .getRestaurantWithReviews(restaurantId)
    .then(({ restaurant, reviews }) => {
      if (restaurant) {
        res.status(200).send({ restaurant: { restaurant, reviews } });
      } else {
        res.status(404).send("Restaurant not found");
      }
    })
    .catch((error) => {
      res.status(500).send({ error: "Error fetching restaurant" });
    });
});
