import * as mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  popularity: Number, //ADDED FOR UDDATING 'RATING' WHEN SUBMIT RATING AGAINST MOVIE ON MOVIE DETAIL PAGE.
  genre_ids: String, //CRINCH, for getting movies with dame genre ids.
  poster_path: String,
  title: String,
  description: String,
  year: String
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
