import Movie from '../models/movie';
import BaseCtrl from './base';

export default class PopularMovieCtrl extends BaseCtrl {
  model = Movie;
  
  
	// Get all BUT NOT ONE EXEMPTED MOVIE
	getTopFive = (req, res) => {
		this.model.find({_id: {$ne: req.params.exemptMovieId}}).sort({popularity: -1}).limit(5).exec(function(err, docs) {
			if (err) { return console.error(err); }
			res.json({"popularmovies":docs});
		});
	};

	
  // Update by id
  
  updatePopularity = (req, res) => {
	this.model.findOne({ '_id' : req.params.movie }, null, null).exec((err, movie) => {	  	  
		this.model.findOneAndUpdate({ '_id' : req.params.movie },{ $set: {	'popularity' : movie.popularity + (req.params.rating / 10) }}, function (err,doc) {
      if (err) { return console.error(err); }      
      res.json({"movie":doc});
    });
	});		

  };
  

}
