import * as mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  user: Object,
  movie: Object,
  rating: Number  
});

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
