import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    calpoly_email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    ],
    reviews_given: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { collection: "accounts" }
);

const Account = mongoose.model("Account", AccountSchema);

export default Account;
