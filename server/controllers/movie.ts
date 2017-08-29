import Movie from '../models/movie';
import BaseCtrl from './base';

export default class MovieCtrl extends BaseCtrl {
  model = Movie;
  
  
	// Get Movie details
	getDetail = (req, res) => {
		this.model.findOne({ _id: req.params.id }, (err, obj) => {
		  //if (err) { return console.error(err); }
		  //res.json(obj);		  
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
		
		if(req.params.searchkey && req.params.searchkey!='undefined')
		{
			//var searchkey = new RegExp(req.params.searchkey, 'i');							
			//var search = {};
			//search['name'] = searchkey;			
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

  // Get movies with same genre id.
  //WORKING BUT NOT WITH RANDOM RECORDS
  /*	
  moviesWithGenreId = (req, res) => {		
		this.model.find({_id: {$ne: req.params.mid}, genre_ids: { $regex: '.*' + req.params.id + '.*' } }).limit(5).exec(function(err, docs){		
			res.json({"movieswithsimilargenres":docs});
		});  
		
  };
  */
  
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

/*
RATED MOVIES BY LOGGED-IN USER:
$myRatedMovies = DB::table('user_ratings')->select('movie_id')->where('user_id',Auth::user()->id)->get();

RATED MOVIES BY OTHER USERS:
$usersWhoRated = DB::table('user_ratings')->select('user_id')->groupBy('user_id')->get();

$file = fopen('movies.csv', 'w');
FOREACH($usersWhoRated as $userWhoRated):
	$csvContent = "";
	IF($myRatedMovies):		
		$moviesRatedByUsers = DB::table('user_ratings')
							  ->select('movie_id')
							  ->where('user_id',$userWhoRated->user_id)
							  ->whereNotIn('movie_id',$myRatedMoviesArr)
							  ->orderBy('movie_id','asc')
							  ->get();
	ELSE:
		$moviesRatedByUsers = DB::table('user_ratings')
							  ->select('movie_id')
							  ->where('user_id',$userWhoRated->user_id)
							  ->orderBy('movie_id','asc')
							  ->get();
	FOREACH($moviesRatedByUsers as $movieRated):
		$csvContent .= $movieRated->movie_id . "," ;
	ENDFOREACH	
	$csvContent = rtrim ($csvContent, ",");
	$csvContent .= PHP_EOL;
	fwrite($file, $csvContent);
ENDFOREACH
fclose($file);

$recommendedMovies = str_replace("[", "",$output);
$recommendedMovies = str_replace("]", "",$recommendedMovies);
$recommendedMovies = str_replace("'", "",$recommendedMovies);
$recom = explode(",", $recommendedMovies);

$recomendedMoviesForUser = Movies::whereIn('id', $recom )->limit(5)->get();  //Movies::whereIn('id',$recommendedMovies)->get();

if($recomendedMoviesForUser->count())
{
	return $recomendedMoviesForUser;
}
else
{
	return false;            
}

*/
