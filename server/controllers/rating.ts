import Rating from '../models/rating';
import Movies_model from '../models/movie'; //CRINCH
import Rating_model_movies from '../models/rating';  //CRINCH
import Rating_model_users from '../models/rating';  //CRINCH
import Rating_model_processing from '../models/rating';  //CRINCH

import BaseCtrl from './base';


/******CHECK ARE REMOVE IF THIS CODE IS NOT BEING USED**********/
var Promise = require('bluebird');  //CRINCH - THIS LINE ADDED TO PROMISE/THEN IN QUERIES IN JACCARD MOVIE FUNCTION - 28-08-17
/**************************************************************/

import * as fs from 'fs';  //CRINCH ADDED AFTER TO WRITE/READ FILE
import * as PythonShell from 'python-shell';  //CRINCH TO EXECUTE PYTHON SCRIPT, IMPORTED THIS MODULE USING TERMINAL, ADD THIS IN PACKAGE.JS FILE

export default class RatingCtrl extends BaseCtrl {
  model = Rating;
  
  // Insert
  insert = (req, res) => {  
	var add = {};
	add['movie'] = req.params.movie;
	add['user'] = req.params.user;
	add['rating'] = req.params.rating;
  
    //const obj = new this.model(req.body);
    const obj = new this.model(add);
    obj.save((err, item) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
      res.status(200).json(item);
    });
  };
  
  
	// Get Movie Rating USER AND MOVIE IDs
	getRating = (req, res) => {	
		var search = {};
		search['movie'] = req.params.movie;			
		search['user'] = req.params.user;					
		this.model.findOne(search, null, null).exec(function(err, obj) {
			if (err)
			  res.json(err);
			else
			  res.json({			  
				"rating": obj
			  });
		});					
	};  

	// Get MOVIES RATED BY ME [LOGGED-IN USER]
	getMyRatedMovies = (req, res) => {	
		var search = {};		
		search['user'] = req.params.user;					
		this.model.find(search, { movie: 1 }, null).exec(function(err, docs) {  // WILL GET MOVIE NOT WHOLE ROW
			if (err)
			  res.json(err);
			else
			  res.json({			  
				"myratedmovies": docs
			  });
		});					
	};  

	// Get USERS WHO RATED MOVIES, GROUP BY user
	getUsersWhoRatedMovies = (req, res) => {	
		this.model.aggregate({ $group : { _id : "$user" } }).exec(function(err, docs) {  //WILL ONLY GET USER NOT WHOLE ROW
			if (err)
			  res.json(err);
			else
			  res.json({			  
				"userswhoratedmovies": docs
			  });
		});					
	};


	getJaccardMovies = (req, res) => {
	var PythonShell = require('python-shell');  //CRINCH, TO EXECUTE PYTHONG SCRIPT
		var csvContent2 = '';
		var search = {};
		
		var hello = new Array();
		if (req.params.movieArr.indexOf(',') > -1)
		{
		  var movieObjArr:any[] = req.params.movieArr.split(",");
		}else{
		  var movieObjArr:any[] = new Array(req.params.movieArr);
		}
		
		this.model.aggregate( { $match : {user:req.params.userId,movie:{ $nin: movieObjArr }}}, {"$group" : {"_id" : "$movie"}}).exec(function(err, docs) {
			if (err)
			  res.json(err);
			else
					if(docs.length > 0){
						for (var i = 0; i < docs.length; i++) {
						  csvContent2+=docs[i]._id + ",";
						}
						//csvContent2 = csvContent2.slice(',',-1)+"\n";						
						csvContent2 = csvContent2.slice(0,-1)+"\n"; //changed on 6sep17						
					}
			  fs.appendFile('movies.csv', csvContent2);
			  res.json({			  
				"moviesratedbyusers": docs
			  });
		});				
	};		  	
	
	getJaccardMoviesNew = (req, res) => {	
		var search = {};				
		search['user'] = req.params.user;					
		var empty_jaccard_movies = [];

		  Rating_model_movies.find(search, { movie: 1, _id : 0 }, null).exec()		  
			.then(function(movies){
			
				if(movies.length ===0)	
				  return res.json({"jaccard_Movies": empty_jaccard_movies});					
				return [movies];
			})
			.then(function(result){
				return Rating_model_users.aggregate({ $group : { _id : "$user" } }).exec()
					.then(function(users){
					
						if(users.length === 0)	
						  return res.json({"jaccard_Movies": empty_jaccard_movies});
						  
						result.push(users);
						return result;
					})
			})
			.then(function(result){
				var movies_to_write = [];
				var process_users = result[1];
				var exemptd_movies = result[0];
				process_users.forEach(function(u) {				
					var exemtedMovies = [];
					for (let movie of exemptd_movies) {
						exemtedMovies.push(movie.movie);						
					}					
					movies_to_write.push(
						Rating_model_processing.aggregate( 
							{ $match : {user:u._id,movie:{ $nin: exemtedMovies }}}, {"$group" : {"_id" : "$movie"}}
														 )
					);					
				});
				return Promise.all(movies_to_write );
			})			
			.then(function(result){
				var compared_movie_arr = [];		
				compared_movie_arr = result;
				
					if(compared_movie_arr.length === 0)	
					  return res.json({"jaccard_Movies": empty_jaccard_movies});
					  
				var csvContent2 = '';									
					if(compared_movie_arr.length > 0){
						for (var i = 0; i < compared_movie_arr.length; i++) {							
							var internal_arr = [];					
							internal_arr = compared_movie_arr[i];						
							for (var j = 0; j < internal_arr.length; j++) {
								console.log(internal_arr[j]._id);
								csvContent2+=internal_arr[j]._id + ",";
							}
							if(csvContent2)		
							//csvContent2 = csvContent2.slice(',',-1)+"\n";
							csvContent2 = csvContent2.slice(0,-1)+"\n";		//changed on 6sep17												
						}
					}				
					
					if(csvContent2){
						fs.open('movies.csv','w',function(error, fp){
							fs.write(fp,csvContent2);
							fs.close(fp);
						});
						var python_options = {
							mode: 'text',
							args: [req.params.movie]
						};						
						PythonShell.run('jaccard.py', python_options, function (err, similar_movies_ids: any) {
							if(similar_movies_ids[0] == '[]')
								return res.json({"jaccard_Movies": empty_jaccard_movies});								
							var hack = similar_movies_ids[0].replace("[","");
							hack = hack.replace("]","");
							hack = hack.split("'").join('');
							hack = hack.split('\'').join('');								
							hack = hack.split(" ").join("");
							var data:any[] = hack.split(",");
							Movies_model.find( { _id:{ $in:  data }}).exec(function(err, similar_movies) {
							console.log('presetn...........');
								if (err){
									console.log('ERROR FOUND...........');
								  console.log(err);  
								  res.json(err);
								}  
								else{
								  console.log('similar movies................:'+similar_movies);	
								  res.json({			  
									"jaccard_Movies": similar_movies
								  });								  
							   }	  
							});	
							
						});														
						
					}else{
						res.json({'jaccard_Movies':empty_jaccard_movies});
					}				
								
				
			})
			.then(undefined, function(err){
			  res.json(err);
			})		
	};						
}


