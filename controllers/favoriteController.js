const User = require('../model/userDetails');

async function toggleFavorite(username, movieId) {
  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      throw new Error('User not found');
    }

    const index = user.favorites.indexOf(movieId);
    if (index !== -1) {
      user.favorites.splice(index, 1); // Remove from favorites
    } else {
      user.favorites.push(movieId); // Add to favorites
    }

    await user.save();

    const isFavorited = index === -1 ? true : false;
    return { success: true, isFavorited: isFavorited }; // Return success response with isFavorited status
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}

async function getFavoriteMoviesByUsername(username) {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      throw new Error('User not found');
    }
    return user.favorites;
  } catch (error) {
    console.error('Error getting favorite movies:', error);
    throw error;
  }
}

module.exports = { toggleFavorite, getFavoriteMoviesByUsername };
