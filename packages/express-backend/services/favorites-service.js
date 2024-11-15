import userModel from "../models/complex.js";

// get all favorite restaurants for a user
function getFavoritesByUser(userId) {
    return userModel
    .findById(userId)
    .populate("favorites")
    .select("favorites");
}

// check if a restaurant is in the user's favorites
async function isFavorite(userId, restaurantId){
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    return user.favorites.includes(restaurantId);
}

// add a restaurant to user's favorites
async function addFavorite(userId, restaurantId) {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    await user.updateOne({ $addToSet: { favorites: restaurantId} });
    return { message: "Restaurant added to favorites"};
}

// remove a restaurant from user's favorites
async function removeFavorite(userId, restaurantId) {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    await user.updateOne({ $pull: { favorites: restaurantId}});
    return{ message: "restaurant removed from favorites"};
}

export default {
    getFavoritesByUser,
    isFavorite,
    addFavorite,
    removeFavorite,
};