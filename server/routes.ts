import * as express from 'express';

import CatCtrl from './controllers/cat';
import MovieCtrl from './controllers/movie';  //CRINCH
import UserCtrl from './controllers/user';
import RatingCtrl from './controllers/rating';  //CRINCH
import PopularMovieCtrl from './controllers/popularmovie';  //CRINCH
import Cat from './models/cat';
import Movie from './models/movie';
import User from './models/user';
import Rating from './models/rating';  //CRINCH

export default function setRoutes(app) {

  const router = express.Router();

  const catCtrl = new CatCtrl();
  const movieCtrl = new MovieCtrl();  
  const userCtrl = new UserCtrl();
  const ratingCtrl = new RatingCtrl();
  const popularmovieCtrl = new PopularMovieCtrl();
  

  // Cats
  //router.route('/cats').get(catCtrl.getAll);
  router.route('/cats').get(catCtrl.getPaginated);
  
  /*router.route('/cats/:page').get(catCtrl.getPaginated);*/
  /*router.route('/cats/:page/:limit').get(catCtrl.getPaginated);*/
  router.route('/cats/:page/:limit/:searchkey').get(catCtrl.getPaginated);
  
  router.route('/cats/count').get(catCtrl.count);
  router.route('/cat').post(catCtrl.insert);
  router.route('/cat/:id').get(catCtrl.get);
  router.route('/cat/:id').put(catCtrl.update);
  router.route('/cat/:id').delete(catCtrl.delete);

  // Movies
  router.route('/movies').get(movieCtrl.getAll);
  //router.route('/movies').get(movieCtrl.getPaginated);  //CRINCH
  router.route('/movie/:id').get(movieCtrl.getDetail);    //CRINCH
  router.route('/movies/count').get(movieCtrl.count);      
  router.route('/movies/:page/:limit/:searchkey').get(movieCtrl.getPaginated);
  router.route('/movieswithgenerid/:id/:mid').get(movieCtrl.moviesWithGenreId);
  //router.route('/movieswithjaccard/:id').get(movieCtrl.moviesWithJaccard);
  
  
  // POPULAR MOVIES
  router.route('/popularmovies/:exemptMovieId').get(popularmovieCtrl.getTopFive);  //CRINCH
  router.route('/popularity/:movie/:rating').get(popularmovieCtrl.updatePopularity);  //CRINCH
  
  
  //RATINGS
  router.route('/ratings/:user/:movie/:rating').get(ratingCtrl.insert);
  router.route('/rating/:user/:movie').get(ratingCtrl.getRating);
  
  router.route('/myratedmovies/:user').get(ratingCtrl.getMyRatedMovies);  //client, movie detail components, function : jaccardMovies
  router.route('/userswhoratedmovies').get(ratingCtrl.getUsersWhoRatedMovies);  //client, movie detail components, function : jaccardMovies
  router.route('/jaccardmovies/:movieArr/:userId').get(ratingCtrl.getJaccardMovies);  //client, movie detail components, function : jaccardMovies
  
  router.route('/jaccardmoviesnew/:user/:movie').get(ratingCtrl.getJaccardMoviesNew);
  
  
  

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
