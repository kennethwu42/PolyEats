import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
      trim: true
    },
    review: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true
    },
    pictures: [
      {
        data: Buffer, //binary in MongoDB
        contentType: String
      }
    ],
    date: {
      type: Date,
      default: Date.now
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    }
  },
  { collection: "reviews" }
);

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
