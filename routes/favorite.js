const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const router = express.Router();

router.post('/toggle-favorite', async (req, res) => {
  const { username, movieId } = req.body;

  try {
    const success = await favoriteController.toggleFavorite(username, movieId);
    if (success) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/get-favorite-movies/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const favoriteMovies = await favoriteController.getFavoriteMoviesByUsername(username);
    res.status(200).json({ success: true, favoriteMovies });
  } catch (error) {
    console.error('Error getting favorite movies:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


module.exports = router;
