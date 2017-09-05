import Rating from '../models/rating';
import Movies_model from '../models/movie'; //CRINCH
import Rating_model_movies from '../models/rating';  //CRINCH
import Rating_model_users from '../models/rating';  //CRINCH
import Rating_model_processing from '../models/rating';  //CRINCH

import BaseCtrl from './base';


/******CHECK ARE REMOVE IF THIS CODE IS NOT BEING USED**********/
var Promise = require('bluebird');  //CRINCH - THIS LINE ADDED TO PROMISE/THEN IN QUERIES IN JACCARD MOVIE FUNCTION - 28-08-17
var mongoose = require('mongoose');  //CRINCH - THIS LINE ADDED TO PROMISE/THEN IN QUERIES IN JACCARD MOVIE FUNCTION - 28-08-17
var mongoose = Promise.promisifyAll(mongoose);  //CRINCH - THIS LINE ADDED TO PROMISE/THEN IN QUERIES IN JACCARD MOVIE FUNCTION - 28-08-17
/**************************************************************/

import * as fs from 'fs';  //CRINCH ADDED AFTER TO WRITE/READ FILE
import * as PythonShell from 'python-shell';  //CRINCH TO EXECUTE PYTHON SCRIPT


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
	
	getJaccardMoviesNew___ = (req, res) => {
	
//https://stackoverflow.com/questions/41743924/how-can-run-mongoose-query-in-foreach-loop
//http://blog.revathskumar.com/2015/07/using-promises-with-mongoosejs.html
	
		var search = {};				
		search['user'] = req.params.user;					
		//
		  Rating_model_movies.find(search, { movie: 1, _id : 0 }, null).exec()		  
			.then(function(movies){
				  return [movies];
			})
			.then(function(result){
				return Rating_model_users.aggregate({ $group : { _id : "$user" } }).exec()
					.then(function(users){
						result.push(users);
						return result;
					})
			})
			.then(function(result){
				var movies_to_write = [];
				var process_users = result[1];
				var exemptd_movies = result[0];
				process_users.forEach(function(u) {
				
/*				
					movies_to_write.push(
						Rating_model_processing.aggregate( 
							{ $match : {user:u._id,movie:{ $nin: 
						[ '5968ca0726eac3841a8b45da', '5968ca0726eac3841a8b45d3','5968ca0726eac3841a8b45c8','5968ca0726eac3841a8b45c8',
							  '5968ca0726eac3841a8b45db','5968ca0726eac3841a8b4571','5968ca0726eac3841a8b4572' ]
						 }}}, 
							{"$group" : {"_id" : "$movie"}}
														 )
					);
*/
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
				//result.push(movies_to_write);
				//return result;
			})			
			.then(function(result){			
			console.log(result);
			  //var movies = result[0];
			  //var users = result[1];
			  //var final_movies = result[2];
			  //res.json({'users_who_rated':users,'my_movies':movies, 'f_movies':final_movies});
			  res.json({'hell':result});
			})
			.then(undefined, function(err){
			  //Handle error
			})		
		//

	};						


	getJaccardMoviesNew_5thSep17 = (req, res) => {
	
		var search = {};				
		search['user'] = req.params.user;					

		  Rating_model_movies.find(search, { movie: 1, _id : 0 }, null).exec()		  
			.then(function(movies){
				  return [movies];
			})
			.then(function(result){
				return Rating_model_users.aggregate({ $group : { _id : "$user" } }).exec()
					.then(function(users){
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
							csvContent2 = csvContent2.slice(',',-1)+"\n";														
						}
						if(csvContent2){
							//fs.appendFile('movies.csv', csvContent2);													
							fs.open('movies.csv','w',function(error, fp){
								fs.write(fp,csvContent2);
								fs.close(fp);
							});
							var python_options = {
								mode: 'text',
								args: [req.params.movie]
							};

							PythonShell.run('jaccard.py', python_options, function (err, similar_movies_ids) {
								if (err)
									console.log('PYTHONG EXECUTION ERROR...............:'+err);
								else
								console.log('results: %j', similar_movies_ids);
								console.log('2ndd results:'+similar_movies_ids);

/*
								Movies_model.find( { _id:{ $in: ['5968ca0726eac3841a8b4590', '5968ca0726eac3841a8b4568'] }}).exec(function(err, similar_movies) {
								console.log('presetn...........');
									if (err){
									  console.log(err);  
									  res.json(err);
									}  
									else{
									console.log('similar movies empty....................:');		
									  console.log('similar movies................:'+similar_movies);	
									  //result.push(similar_movies);	
									  //return result;
									  
									  res.json({			  
										"jaccard_Movies": similar_movies
									  });
									  
								   }	  
								});				

*/
								
								
							});														
							
						}				
					}				
					
				
				
				res.json({'hell':compared_movie_arr});
			})
			.then(undefined, function(err){
			  res.json(err);
			})		
		//

	};	
	
	
	
	getJaccardMoviesNew = (req, res) => {
	
		var search = {};				
		search['user'] = req.params.user;					

		  Rating_model_movies.find(search, { movie: 1, _id : 0 }, null).exec()		  
			.then(function(movies){
				  return [movies];
			})
			.then(function(result){
				return Rating_model_users.aggregate({ $group : { _id : "$user" } }).exec()
					.then(function(users){
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
							csvContent2 = csvContent2.slice(',',-1)+"\n";														
						}
					}				
					
					if(csvContent2){
						//fs.appendFile('movies.csv', csvContent2);													
						fs.open('movies.csv','w',function(error, fp){
							fs.write(fp,csvContent2);
							fs.close(fp);
						});
						var python_options = {
							mode: 'text',
							args: [req.params.movie]
						};
						
						PythonShell.run('jaccard.py', python_options, function (err, similar_movies_ids: any) {

								console.log('results: %j', similar_movies_ids);
								console.log('2ndd results:'+similar_movies_ids); //['5968ca0726eac3841a8b4590', '5968ca0726eac3841a8b4568']
	
/*	
var hack = similar_movies_ids[0].replace("[","");
hack = hack.replace("]","");
var hack1 = hack.replace("'","");
var hack2 = hack.replace("'","");
var hack3 = hack2.replace("\'","");
var hack4 = hack3.replace("\'","");
var hack5 = hack4.replace("\'","");
var hack6 = hack5.replace("\'","");
var hack7 = hack6.replace(" ","");
var data:any[] = hack7.split(",");
*/

var hack = similar_movies_ids[0].replace("[","");
hack = hack.replace("]","");


//hack = hack.replace("'","");
//hack = hack.replace("'","");
hack = hack.split("'").join('');

//hack = hack.replace("\'","");
//hack = hack.replace("\'","");
//hack = hack.replace("\'","");
//hack = hack.replace("\'","");
hack = hack.split('\'').join('');

hack = hack.replace(" ","");
var data:any[] = hack.split(",");





								//Movies_model.find( { _id:{ $in: ['5968ca0726eac3841a8b4590', '5968ca0726eac3841a8b4568'] }}).exec(function(err, similar_movies) {
								Movies_model.find( { _id:{ $in:  data }}).exec(function(err, similar_movies) {
								console.log('presetn...........');
									if (err){
									  console.log(err);  
									  res.json(err);
									}  
									else{
									console.log('similar movies empty....................:');		
									  console.log('similar movies................:'+similar_movies);	
									  //result.push(similar_movies);	
									  //return result;
									  
									  res.json({			  
										"jaccard_Movies": similar_movies
									  });
									  
								   }	  
								});	
							
						});														
						
					}				
								
				//res.json({'hell':compared_movie_arr});
			})
			.then(undefined, function(err){
			  res.json(err);
			})		
		//

	};						



/*
{ "_id" : ObjectId("598c4c975d04ef42ccdf13c3"), "movie" : "5968ca0726eac3841a8b4567", "user" : "5964da0bcbabf42793e20bb0", "rating" : 5, "__v" : 0 }
{ "_id" : ObjectId("599425e4e5ac5a2c11b9b886"), "movie" : "5968ca0726eac3841a8b4590", "user" : "5964dad2cbabf42793e20bb2", "rating" : 4, "__v" : 0 }
{ "_id" : ObjectId("599427e8570a2030b0fdc404"), "movie" : "5968ca0726eac3841a8b45da", "user" : "59942785570a2030b0fdc403", "rating" : 4, "__v" : 0 }
{ "_id" : ObjectId("59942858570a2030b0fdc405"), "movie" : "5968ca0726eac3841a8b45d3", "user" : "59942785570a2030b0fdc403", "rating" : 2, "__v" : 0 }
{ "_id" : ObjectId("5996c296b0acbc173d243878"), "movie" : "5968ca0726eac3841a8b4568", "user" : "5964da0bcbabf42793e20bb0", "rating" : 5, "__v" : 0 }
{ "_id" : ObjectId("5996c2c9b0acbc173d243879"), "movie" : "5968ca0726eac3841a8b4567", "user" : "5964dad2cbabf42793e20bb2", "rating" : 5, "__v" : 0 }
{ "_id" : ObjectId("5996c2d7b0acbc173d24387a"), "movie" : "5968ca0726eac3841a8b4568", "user" : "5964dad2cbabf42793e20bb2", "rating" : 5, "__v" : 0 }
{ "_id" : ObjectId("599a8475955786181a6a5f0d"), "movie" : "5968ca0726eac3841a8b45c8", "user" : "59942785570a2030b0fdc403", "rating" : 4, "__v" : 0 }
{ "_id" : ObjectId("599a847b955786181a6a5f0e"), "movie" : "5968ca0726eac3841a8b45c8", "user" : "59942785570a2030b0fdc403", "rating" : 4, "__v" : 0 }
{ "_id" : ObjectId("599a8485955786181a6a5f0f"), "movie" : "5968ca0726eac3841a8b45db", "user" : "59942785570a2030b0fdc403", "rating" : 5, "__v" : 0 }
{ "_id" : ObjectId("599c080bd9ab631c790c00b1"), "movie" : "5968ca0726eac3841a8b4571", "user" : "59942785570a2030b0fdc403", "rating" : 4, "__v" : 0 }
{ "_id" : ObjectId("599c082ad9ab631c790c00b2"), "movie" : "5968ca0726eac3841a8b4572", "user" : "59942785570a2030b0fdc403", "rating" : 4, "__v" : 0 }

OMER 403:
{ "_id" : ObjectId("599427e8570a2030b0fdc404"), "movie" : "5968ca0726eac3841a8b45da", "user" : "59942785570a2030b0fdc403", "rating" : 4, "__v" : 0 }
{ "_id" : ObjectId("59942858570a2030b0fdc405"), "movie" : "5968ca0726eac3841a8b45d3", "user" : "59942785570a2030b0fdc403", "rating" : 2, "__v" : 0 }
{ "_id" : ObjectId("599a8475955786181a6a5f0d"), "movie" : "5968ca0726eac3841a8b45c8", "user" : "59942785570a2030b0fdc403", "rating" : 4, "__v" : 0 }
{ "_id" : ObjectId("599a847b955786181a6a5f0e"), "movie" : "5968ca0726eac3841a8b45c8", "user" : "59942785570a2030b0fdc403", "rating" : 4, "__v" : 0 }
{ "_id" : ObjectId("599a8485955786181a6a5f0f"), "movie" : "5968ca0726eac3841a8b45db", "user" : "59942785570a2030b0fdc403", "rating" : 5, "__v" : 0 }
{ "_id" : ObjectId("599c080bd9ab631c790c00b1"), "movie" : "5968ca0726eac3841a8b4571", "user" : "59942785570a2030b0fdc403", "rating" : 4, "__v" : 0 }
{ "_id" : ObjectId("599c082ad9ab631c790c00b2"), "movie" : "5968ca0726eac3841a8b4572", "user" : "59942785570a2030b0fdc403", "rating" : 4, "__v" : 0 }



Asif bb0:
{ "_id" : ObjectId("598c4c975d04ef42ccdf13c3"), "movie" : "5968ca0726eac3841a8b4567", "user" : "5964da0bcbabf42793e20bb0", "rating" : 5, "__v" : 0 }
{ "_id" : ObjectId("5996c296b0acbc173d243878"), "movie" : "5968ca0726eac3841a8b4568", "user" : "5964da0bcbabf42793e20bb0", "rating" : 5, "__v" : 0 }


Usman bb2:
{ "_id" : ObjectId("599425e4e5ac5a2c11b9b886"), "movie" : "5968ca0726eac3841a8b4590", "user" : "5964dad2cbabf42793e20bb2", "rating" : 4, "__v" : 0 }
{ "_id" : ObjectId("5996c2c9b0acbc173d243879"), "movie" : "5968ca0726eac3841a8b4567", "user" : "5964dad2cbabf42793e20bb2", "rating" : 5, "__v" : 0 }
{ "_id" : ObjectId("5996c2d7b0acbc173d24387a"), "movie" : "5968ca0726eac3841a8b4568", "user" : "5964dad2cbabf42793e20bb2", "rating" : 5, "__v" : 0 }
*/

	
}


