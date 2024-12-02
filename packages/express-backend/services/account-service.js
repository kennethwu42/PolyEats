import accountModel from "../models/account.js";
import reviewModel from "../models/review.js";
import restaurantModel from "../models/restaurant.js";
import { uploadFileToGCS, deleteFileFromGCS } from "../googleCloudStorage.js";

//fetch account details by ID (excluding password)
async function getAccountDetails(accountId) {
  return accountModel
    .findById(accountId, "-password")
    .populate("favorites")
    .exec();
}

//update profile picture path for an account
async function updateProfilePicture(accountId, file) {
  const account = await accountModel.findById(accountId);
  if (!account) {
    throw new Error("Account not found");
  }

  // If the account already has a custom profile picture, delete it first
  const DEFAULT_PROFILE_PIC =
    "https://storage.googleapis.com/polyeats/profile-pictures/defaultprofilepic.jpeg";

  if (account.profile_pic !== DEFAULT_PROFILE_PIC) {
    const oldFilePath = account.profile_pic.split(
      "https://storage.googleapis.com/polyeats/"
    )[1];
    await deleteFileFromGCS(oldFilePath);
  }

  // Upload the new profile picture
  const publicUrl = await uploadFileToGCS(file, "profile-pictures");

  account.profile_pic = publicUrl;
  await account.save();
  return account;
}

//remove profile pic
async function removeProfilePicture(accountId) {
  const account = await accountModel.findById(accountId);
  if (!account) {
    throw new Error("Account not found");
  }

  const DEFAULT_PROFILE_PIC =
    "https://storage.googleapis.com/polyeats/profile-pictures/defaultprofilepic.jpeg";

  // If the account has a custom profile picture, delete it from Google Cloud Storage
  if (account.profile_pic !== DEFAULT_PROFILE_PIC) {
    const filePath = account.profile_pic.split(
      "https://storage.googleapis.com/polyeats/"
    )[1];
    console.log(filePath);
    await deleteFileFromGCS(filePath);
  }

  account.profile_pic = DEFAULT_PROFILE_PIC;
  await account.save();
  return account;
}

//fetch reviews given by the account
async function getAccountReviews(accountId) {
  return reviewModel
    .find({ author: accountId })
    .populate("author", "firstname lastname profile_pic") // Ensure profile_pic is included
    .exec();
}

//fetch favorite restaurants saved by the account
async function getFavoriteRestaurants(accountId) {
  return restaurantModel
    .find({
      _id: { $in: (await accountModel.findById(accountId)).favorites }
    })
    .exec();
}

//add a restaurant to favorites
async function addFavoriteRestaurant(accountId, restaurantId) {
  const account = await accountModel.findById(accountId);
  if (!account.favorites.includes(restaurantId)) {
    account.favorites.push(restaurantId);
    await account.save();
  }
  return account;
}

//remove a restaurant from favorites
async function removeFavoriteRestaurant(accountId, restaurantId) {
  const account = await accountModel.findById(accountId);
  account.favorites = account.favorites.filter(
    (fav) => fav.toString() !== restaurantId
  );
  await account.save();
  return account;
}

async function deleteAccount(accountId) {
  await accountModel.findByIdAndDelete(accountId);
  await reviewModel.deleteMany({ author: accountId });
  //any additional cleanup goes here
  return { message: "Account successfully deleted" };
}

export default {
  getAccountDetails,
  updateProfilePicture,
  removeProfilePicture,
  getAccountReviews,
  getFavoriteRestaurants,
  addFavoriteRestaurant,
  removeFavoriteRestaurant,
  deleteAccount
};
