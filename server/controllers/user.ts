import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import User from '../models/user';
import Ldapuser from '../models/ldap';
import BaseCtrl from './base';

var Promise = require('bluebird');  //CRINCH - THIS LINE ADDED TO PROMISE/THEN IN QUERIES IN JACCARD MOVIE FUNCTION - 28-08-17

export default class UserCtrl extends BaseCtrl {
  model = User;
  ldapmodel = new Ldapuser();

  login = (req, res) => {
    this.model.findOne({ email: req.body.email }, (err, user) => {
      if (!user) { return res.sendStatus(403); }
      user.comparePassword(req.body.password, (error, isMatch) => {
        if (!isMatch) { return res.sendStatus(403); }
        const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
        res.status(200).json({ token: token });
      });
    });
  };
  
  
  // Insert/Add LDAP user in database
  insertLdapUser = (req, res) => {    
  console.log('ldap register in controller');
    const obj = new this.model(req.body);    
    obj.save((err, user) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
      console.log(user);      
      const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds                  
      //res.status(200).json({ token: token });
      res.status(200).json(token);
    });
  };
  	
  loginldap = (req, res) => {
    this.ldapmodel.getAuthenticationStatus(req.body.username, req.body.password  , (err, user) => {
		if (!user) { return res.sendStatus(403); }		
		var searchByEmail = {};				
		searchByEmail['email'] = user.Email;							
		var findUserByEmail = this.model.find(searchByEmail, null, null).exec();
		var allDone = Promise.all([findUserByEmail]);
		allDone.then(function(userAlreadyExists){
		    var returnStatus = {};		
			if(userAlreadyExists[0][0]){
			    returnStatus['status'] = 1; // NEED LOGGED IN
			    returnStatus['user'] = userAlreadyExists[0][0];
			    const token = jwt.sign({ user: userAlreadyExists[0][0] }, process.env.SECRET_TOKEN);
			    returnStatus['token'] = token;
				res.json(returnStatus);
			}else{				
			    returnStatus['status'] = 2;  //NEED REGISTRATION
			    returnStatus['user'] = user;
			}
			return res.json(returnStatus);				
		});		
    });

	
	

	
  };

}
