const models = require('../models');
/*for password encryption */
const bcrypt = require("bcryptjs");
const saltRounds = 10;


/*display login pages*/
var get_login_info = function(req, res, next) {
	res.render('login');
};

/* get login details and authenticate login*/
var auth_login = function(req, res, next) {
	let email_auth = req.body.email;
	//console.log("mail:"+email_auth);
	models.Users.findOne({ where: { email: email_auth } })
	.then(user => { 
		/*match user password and authenticate*/
		if(user!=null)
		{
			//user exists
			let user_provided_password = req.body.password;
			let valid_password_hash = user.password;
			let user_email = user.email;
			bcrypt.compare(user_provided_password, valid_password_hash)
  			.then(result => {
    			//console.log(result);
    			if(result == true)
    			{
    				/*password correct*/
    				//start session
    			
					//set email for session
					req.session.email = user_email;
					res.render('login_successful',{email: user_email});
    			}
    			else
    			{
    				/*password incorrect */
    				res.render('login_error');
    			}
  			})
  			.catch(err => console.error(err.message));
		}
		else
		{
			//user doesnt exist
			res.render("loginerror_userdoesnotexists");
		}
		

		//console.log(`user_email: ${user.email}`); 
	});
	
	//res.render('login');
};


/* display register new user page */
var register_new_user = function(req, res, next) {
	res.render('register');
};

/* add new user registration info to db */
var add_new_user_info = function(req, res, next) {
	/* validate password strength */
	 var passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
	 var password = req.body.password;
	 if(passwordRegex.test(password))
	 {
	 	/*strong password*/

	 	//search db to find any user with same email
		let user_email = req.body.email;
		models.Users.findOne({ where: { email: user_email } })
		.then(user => { 
			//console.log("user"+user.email);
			if(user!=null)
			{
				//user exist in db
				console.log('user exists');
				res.render('loginerror_userexists');
			}
			else
			{
				//user with same email doesnt exist
				/*encrypt password using bcrypt*/
	 			bcrypt.genSalt(saltRounds)
	 			.then(salt => {
    				console.log(`Salt: ${salt}`);
    				return bcrypt.hash(password, salt);
  				})
  				.then(hash => {
    				console.log(`Hash: ${hash}`);
    				// Store hash in your password DB.
    				return models.Users.create({
						email: req.body.email,
						password: hash,
						firstname: req.body.firstname,
						lastname: req.body.lastname
					})
					.then(Users => {
						res.render('registration_successful');
					})
  				})
  				.catch(err => console.error(err.message));
			}
		
  		})
  		.catch(err => console.error(err.message));	 	
	 }
	 else
	 {
	 	/*create new password*/
	 	res.render('registration_incorrectpassword');
	 }
	
};

/* display homepage */
var display_homepage = function(req, res, next) {
	//Check if session exists
	
	var sess = req.session;
	console.log(req.session.email);
	 if (sess.email) 
	 { 
	 	console.log('session set');
	 	res.render('homepage',{email: sess.email});
    	
    }
	else 
	{
		console.log('session not set');
    	res.render('login');
  	}
	
};

/* logout user and end session */
var logout = function(req, res, next) {
//	req.session = null;
	req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
	//res.render('login');
};


// /* view user info from database */
var view_account_details = function(req, res, next) {
	let user_email = req.session.email;
	//search db to find any user with same email
		 models.Users.findOne({ where: { email: user_email } })
		 .then(user => { 
			console.log('email:'+user.email);
			res.render('account_details', {email: user.email, firstname: user.firstname, lastname:user.lastname});
		 })
		 .catch(err => console.error(err.message));
}



//get new info to update the account details
var change_account_details = function(req, res, next) {
	res.render('get_new_account_details');
} 

//update user account details
var update_account_details = function(req, res, next) {
	let user_email = req.session.email;
	let user_firstname = req.body.firstname;
	let user_lastname = req.body.lastname;

	models.Users.update({ firstname: user_firstname , lastname: user_lastname}, {
  		where: {
    		email: user_email
  		}
	})
	.then((result) => {
		console.log(result);
	})
	.catch(err => console.error(err.message));
	res.render('details_updated');	
}

//get new password from user
var update_password = function(req, res, next) {
	res.render('get_new_password');
}

//change password for user  
var change_password_details = function(req, res, next) {
	/* validate password strength */
	 var passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
	 var password = req.body.password;
	 var user_email = req.session.email;
	 if(passwordRegex.test(password))
	 {
	 	/*strong password*/
		/*encrypt password using bcrypt*/
	 	bcrypt.genSalt(saltRounds)
	 	.then(salt => {
    		console.log(`Salt: ${salt}`);
    		return bcrypt.hash(password, salt);
  		})
  		.then(hash => {
    		console.log(`Hash: ${hash}`);
    		// Store hash in your password DB.
    			models.Users.update({ password: hash}, {
						where: {
							email: user_email
						}
					}).then((result) => {
						console.log(result);
						res.render('login_with_new_password');
					})
  				})
  				.catch(err => console.error(err.message));
	 }
	 else
	 {
	 	/*create new password*/
	 	res.render('registration_incorrectpassword');
	 }
	
} 

exports.get_login_info = get_login_info;
exports.auth_login = auth_login;
exports.register_new_user = register_new_user;
exports.add_new_user_info = add_new_user_info;
exports.display_homepage = display_homepage;
exports.logout = logout;
exports.view_account_details = view_account_details;
exports.change_account_details = change_account_details;
exports.update_account_details = update_account_details;
exports.update_password = update_password;
exports.change_password_details = change_password_details;