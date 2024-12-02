import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true
    },
    lastname: {
      type: String,
      required: true,
      trim: true
    },
    calpoly_email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    profile_pic: {
      type: String,
      trim: true,
      default:
        "https://storage.googleapis.com/polyeats/profile-pictures/defaultprofilepic.jpeg"
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { collection: "accounts" }
);

const Account = mongoose.model("Account", AccountSchema);

export default Account;
