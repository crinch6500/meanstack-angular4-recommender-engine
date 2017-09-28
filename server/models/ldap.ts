import * as ldap from 'ldapjs';
//import * as LdapClient from 'promised-ldap';

//var Promise = require('bluebird');

var Promise = require('bluebird');  //CRINCH - THIS LINE ADDED TO PROMISE/THEN IN QUERIES IN JACCARD MOVIE FUNCTION - 28-08-17
export default class LdapModel {

	ldap_server: String;
	auth_user: String;
	auth_pass: String;
	ldaptree: String;
	base_dn: String;	

	constructor (){
		this.ldap_server = "ldap://10.28.82.2";
		this.auth_user = "nxb.movies@nextbridge.org";
		this.auth_pass = "Do0aiXei";
		this.ldaptree = "OU=VTEAMS,DC=nextbridge,DC=org";
		this.base_dn = "DC=nextbridge, DC=org";		
	}
	
	
	getAuthenticationStatus = function(username, password, callback) {

		function doSearch(configArr) {
			var searchedUser = [];			
					var opts = {
						scope: 'sub',
						filter: "(sAMAccountName="+configArr.username+")"
					};			
		  client.searchAsync(configArr.base_dn, opts)
			.then(function (result) {
				var searchedUser = [];
				result.on('searchEntry', function(entry) {
					searchedUser.push({
						'DisplayName': entry.object.displayName,
						'Name': entry.object.name,
						'Email': entry.object.mail,
						'UserName': entry.object.sAMAccountName								
					});			
				});
				
				result.on('end', function(result) {
					if (searchedUser.length) {					
						client.bind(searchedUser[0].Name, password, function(error) {
							if(error){
								console.log('LDAP: SERACHED USER BINDING FAILED.......');
								if (error) { return callback('LDAP: SERACHED USER BINDING FAILED.......'); }
							}else{								
								client.unbind(function(err_unbind) {
									if(err_unbind){
										console.log('LDAP: SEARCHED USER UNBINDING FAILD');
										return callback('LDAP: SEARCHED USER UNBINDING FAILD');
									}										  
								});
								console.error('LDAP: Searched User Foud');
								return callback(null, searchedUser[0]);
							}
						});
					}else{
						console.error('LDAP: Searched User Not Foud');
						return callback('LDAP: Searched User Not Foud');
					}
				});				
			})
			.catch(function (err) { // Catch potential errors and handle them
			  console.error('LDAP: Error On User searching', err);
			  return callback('Error on LDAP user search');
			});
		}

		var config_arr = {};	
		config_arr['ldap_server'] = this.ldap_server;
		config_arr['auth_user'] = this.auth_user;
		config_arr['auth_pass'] = this.auth_pass;
		config_arr['ldaptree'] = this.ldaptree;
		config_arr['base_dn'] = this.base_dn;	
		config_arr['username'] = username;
		config_arr['password'] = password;
		
		var client = ldap.createClient({url: this.ldap_server});			
		if(!(client)){
			console.log("Error: Unable to connect to authentication server");
			return callback("LDAP: Unable to connect to authentication server");
		}else{
			Promise.promisifyAll(client);
			client.bindAsync(this.auth_user, this.auth_pass)
			  .then(doSearch(config_arr))
			  .catch(function (err) {
				console.error('LDAP: Error On bindAsync', err)
				if (err) { return callback(err); }
			  });
		}
	};	
}
