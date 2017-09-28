import Movie from '../models/movie';
import BaseCtrl from './base';

export default class MovieCtrl extends BaseCtrl {
  model = Movie;
  
  
	// Get Movie details
	getDetail = (req, res) => {
		this.model.findOne({ _id: req.params.id }, (err, obj) => {
			if (err)
			  res.json(err);
			else
			  res.json({			  
				"movie": obj
			  });
		});		
			
	};
  
  // Get Paginated Records with limit 2 as default  
  getPaginated = (req, res) => {
  
		if(!req.params.page)
		{
			var page:number = 1;
		}else{
			var page:number = +req.params.page;
		}

		if(!req.params.limit)
		{
			var limit:number = 2;
		}else{
			var limit:number = +req.params.limit;  // + sign used to make it number, otherwise query return error to be limit must be a number
		}
		
		if(req.params.searchkey && req.params.searchkey!='empty')
		{
			var toSearch = req.params.searchkey.split(" ").map(function(n) {
				return {
					title: new RegExp(n.trim(), 'i')
				};
			});			
			var search = {};
			search['$and'] = toSearch;
		}else{			
			var search = {};
		}
  
	this.model.find(search, null, null).count((err, count) => {	  	  
		this.model.find(search, null, null).skip((page-1)*limit).limit(limit).exec(function(err, docs) {
			if (err)
			  res.json(err);
			else
			  res.json({
			  "total": count,
				"movies": docs
			  });
		});
	});		
  };

  
  //WORKING WITH RANDOM RECORDS
  moviesWithGenreId = (req, res) => {		
		this.model.find({_id: {$ne: req.params.mid}, genre_ids: { $regex: '.*' + req.params.id + '.*' } }).count((err, count) => {
		var random = Math.floor(Math.random() * count);
		  this.model.find({_id: {$ne: req.params.mid}, genre_ids: { $regex: '.*' + req.params.id + '.*' } }).skip(random).limit(5).exec(function (err, docs) {			  
			  console.log(docs); 
			  res.json({"movieswithsimilargenres":docs});
			});
		});  
  };
  
}

