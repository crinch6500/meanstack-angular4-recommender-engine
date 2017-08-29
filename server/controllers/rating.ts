import Rating from '../models/rating';
import BaseCtrl from './base';

var Promise = require('bluebird');  //CRINCH - THIS LINE ADDED TO PROMISE/THEN IN QUERIES IN JACCARD MOVIE FUNCTION - 28-08-17
var mongoose = require('mongoose');  //CRINCH - THIS LINE ADDED TO PROMISE/THEN IN QUERIES IN JACCARD MOVIE FUNCTION - 28-08-17
var mongoose = Promise.promisifyAll(mongoose);  //CRINCH - THIS LINE ADDED TO PROMISE/THEN IN QUERIES IN JACCARD MOVIE FUNCTION - 28-08-17

import * as fs from 'fs';  //CRINCH ADDED AFTER TO WRITE/READ FILE


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

	// Get USERS WHO RATED MOVIES
	/*
	getUsersWhoRatedMovies = (req, res) => {	
		this.model.find({}, { user: 1 }, null).exec(function(err, docs) {  //WILL ONLY GET USER NOT WHOLE ROW
			if (err)
			  res.json(err);
			else
			  res.json({			  
				"userswhoratedmovies": docs
			  });
		});					
	};
	*/
	
	//db.sales.aggregate( [ { $group : { _id : "$item" } } ] )
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
		//search['user'] = req.params.userId;
		//search['$nin'] = req.params.movieArr;
		//search['$nin'] = '5968ca0726eac3841a8b45da';
		//search['$nin'] = ObjectId(req.params.movieArr);
		
		
		//
		var hello = new Array();
		if (req.params.movieArr.indexOf(',') > -1)
		{
		  var movieObjArr:any[] = req.params.movieArr.split(",");
		}else{
		  var movieObjArr:any[] = new Array(req.params.movieArr);
		}
		//
		//var movieObjArr = req.params.movieArr.split(",");
		

		
		//this.model.find({}, { user: 1 }, null).exec(function(err, docs) {  //WILL ONLY GET USER NOT WHOLE ROW
		//this.model.find({}, search,null).sort({movie: -1}).exec(function(err, docs) {
		//this.model.find( { user: req.params.userId, movie: { $nin: ["5968ca0726eac3841a8b45da","5968ca0726eac3841a8b45d3"] } } ).exec(function(err, docs) {
		//this.model.find( { user: req.params.userId, movie: { $nin: hello } } ).sort({movie: -1}).exec(function(err, docs) {
		//this.model.find( { user: req.params.userId, movie: { $nin: movieObjArr } } ).sort({movie: -1}).exec(function(err, docs) {
		this.model.aggregate( { $match : {user:req.params.userId,movie:{ $nin: movieObjArr }}}, {"$group" : {"_id" : "$movie"}}).exec(function(err, docs) {
			if (err)
			  res.json(err);
			else
			//
			console.log('HAC......................'+docs.length);
					if(docs.length > 0){
						for (var i = 0; i < docs.length; i++) {
						  csvContent2+=docs[i]._id + ",";
						}
						csvContent2 = csvContent2.slice(',',-1)+"\n";						
						//csvContent2 = csvContent2.slice(",",-1);						
						//csvContent2 += "\n";						
					}
				//http://www.redotheweb.com/2012/06/17/nodejs-for-php-programmers-4-streams.html
				//https://stackoverflow.com/questions/30689526/how-to-call-python-script-from-nodejs?rq=1
				//https://github.com/extrabacon/python-shell
			  fs.appendFile('movies.csv', csvContent2);
			  //fs.close();
			  //var path = './';
			  //var fileStream = fs.createReadStream(path+'movies.csv');
			  //fileStream.pipe(csvContent2);
			  //fileStream.on('end', function() { 
				//console.log('file written '); 
			 // });			  
			//  
			  res.json({			  
				"moviesratedbyusers": docs
			  });
		});				
	};
	
	  

  //db.myCollection.find({'blocked.user': {$nin: [11, 12, 13]}});
  //db.myCollection.find({'blocked.user': {$ne: 11}});
  
  //http://blog.revathskumar.com/2015/07/using-promises-with-mongoosejs.html
  
  
	getJaccardMoviesNewOld = (req, res) => {
		var search = {};		
		var myMovies = Array();
		var usersWhoRatedMovies = Array();
		search['user'] = req.params.user;					
		console.log(req.params.user);	
		

		this.model.find(search, {'movie':1,'_id':0}, null).exec(function(err, movies) {
			if (err)
			  res.json(err);
			else
				res.json({"hello":movies});
				console.log(movies);								
		});

	};

	getJaccardMoviesNewOne = (req, res, next) => {
		var search = {};				
		search['user'] = req.params.user;					
		//https://stackoverflow.com/questions/21829789/node-mongoose-find-query-in-loop-not-working
		
		
			//https://stackoverflow.com/questions/44064211/mongoose-mongodb-how-to-use-promise-with-aggregate-queries
			var movies = this.model.find(search, {'movie':1,'_id':0}, null).exec();
			var usersWhoRated = this.model.aggregate({ $group : { _id : "$user" } }).exec();



			var allDone = Promise.all([movies,usersWhoRated]);
				allDone.then(function(result){			
					var users = result[1];
					var movies_exmp = result[0];	
					
					//
					var exemtedMovies = [];
					for (let movie of movies_exmp) {
						exemtedMovies.push(movie.movie);						
					}			
					if (exemtedMovies.indexOf(',') > -1)
					{
					  var movieObjArr:any[] = exemtedMovies.split(",");
					}else{
					  var movieObjArr:any[] = new Array(exemtedMovies);
					}
					var final_movies = [];
					//"59942785570a2030b0fdc403"	
					//




					res.json({
						"movies" : movies_exmp,
						"users" : users
					});

					
					
				});			

		//		

	};				
	
	getJaccardMoviesNew = (req, res, next) => {
		var search = {};				
		search['user'] = req.params.user;					
		//https://stackoverflow.com/questions/21829789/node-mongoose-find-query-in-loop-not-working
		
		

	};				
	
}
