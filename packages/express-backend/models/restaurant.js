import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    complex_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Complex"
    },
    hours: {
      M: { type: String, default: "CLOSED" },
      T: { type: String, default: "CLOSED" },
      W: { type: String, default: "CLOSED" },
      TH: { type: String, default: "CLOSED" },
      F: { type: String, default: "CLOSED" },
      SAT: { type: String, default: "CLOSED" },
      SUN: { type: String, default: "CLOSED" }
    },
    avg_rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    delivery: {
      type: Boolean,
      default: false
    },
    accepted_payments: {
      PolyCard: { type: Boolean, default: false },
      CreditDebit: { type: Boolean, default: false },
      Cash: { type: Boolean, default: false }
    },
    cuisine: {
      type: String,
      trim: true
    },
    nutrition_types: {
      Vegan: { type: Boolean, default: false },
      Vegetarian: { type: Boolean, default: false },
      GlutenFree: { type: Boolean, default: false }
    },
    price: {
      type: String,
      enum: ["$", "$$", "$$$"],
      default: "$$"
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
      }
    ]
  },
  { collection: "restaurants" }
);

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

export default Restaurant;
