// grab the horse model we just created
var Horse 		= require('./models/horse');
var User 		= require('./models/user');
var bcrypt 		= require('bcrypt-nodejs');
var passport 	= require('passport');
var jwt 		= require('jwt-simple');
var config		= require('../config/db');
var multer 		= require('multer');
var mongoose    = require('mongoose');


    module.exports = function(app) {
		
    	function sessionCheck(req,res,next){

		    if(req.session.user) next();
		        else res.send(401,'authorization failed');
		}

		getToken = function (headers) {
		  if (headers && headers.authorization) {
		    var parted = headers.authorization.split(' ');
		    if (parted.length === 2) {
		      return parted[1];
		    } else {
		      return null;
		    }
		  } else {
		    return null;
		  }
		};

		var storage = multer.diskStorage({
		  destination: function (req, file, cb) {
		    cb(null, 'public/img/')
		  },
		  filename: function (req, file, cb) {
		  	//console.log(req.body.imgName);
		  	var file = req.body.imgName + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
		    cb(null, file)
		  }
		})

		var upload 	= multer({ storage: storage }).single('file');
	/*

	var storage = multer.diskStorage({ //multers disk storage settings
	    destination: function (req, file, cb) {
	        cb(null, 'public/img/')
	    },
	    filename: function (req, file, cb) {
	    	console.log(file);
	    	console.log(req.file);
	        var datetimestamp = Date.now();
	        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
	    }
	});


	var upload = multer({ //multer settings
	        storage: storage
	    }).single('file');
	*/


        // server routes ===========================================================
        // handle things like api calls

        // AUTH routes ===========================================================

        // login
        app.post('/api/login', function(req, res) {
			var username = req.body.username;
		  	var password = req.body.password;

			User.findOne({
			  username: username
			}, function(err, data) {
				if (err | data === null) {
				  return res.send(401, "User Doesn't exist");
				} else {
				  var usr = data;

				  if (username == usr.username && bcrypt.compareSync(password, usr.password)) {

				  	var token = jwt.encode(usr, config.secret);
				  	res.json({success: true, token: 'JWT ' + token});
				    /*
				    req.session.regenerate(function() {
				      req.session.user = username;
				      console.log("User: " + username + " logged in!");
				      return res.send(username);
				    }); */
				  } else {

				    return res.send(401, "Bad Username or Password");
				  }
				}
			});
		});

        /*
		app.get('/api/logout', function(req, res) {
		    req.session.destroy(function() {
		    	console.log("User logged out!");
		        return res.send(401, 'User logged out');
		    });
		}); */

		app.get('/api/dashboard',  passport.authenticate('jwt', { session: false}), function(req, res) {
			var token = getToken(req.headers);
			if (token) {
			    var decoded = jwt.decode(token, config.secret);
			    User.findOne({
			      username: decoded.username
			    }, function(err, user) {
			        if (err) throw err;
			 
			        if (!user) {
			          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
			        } else {
			          res.json({success: true, msg: 'Welcome in the member area ' + user.username + '!'});
			        }
			    });
			} else {
				return res.status(403).send({success: false, msg: 'No token provided.'});
			}
		});

		// UPLOAD routes ===========================================================
		
		/*
		app.post('/api/upload', multer({ dest: 'public/img/'}).single('file'), function(req, res){
			console.log(req.body); //form fields
			console.log(req.file); //form files
			res.status(204).end();
		}); */
	
		/*
		app.post('/api/upload', upload.single('file'), function (req, res, next) {
		  console.log(req.file);
		  console.log(req.body);
		  next();
		  // req.file is the `avatar` file
		  // req.body will hold the text fields, if there were any
		}) */

		app.post('/api/upload', function(req, res) {
	        upload(req, res, function(err){
	            if(err){
	                 res.json({error_code:1,err_desc:err});
	                 return;
	            }

				app.set('data', req.file.filename);

	            res.json({error_code:0,err_desc:null});
	        })
	       
	    });

		/*
		app.post('/api/upload', function(req, res) {
	        upload(req,res,function(err){
	            if(err){
	                 res.json({error_code:1,err_desc:err});
	                 return;
	            }
	             res.json({error_code:0,err_desc:null});
	        })
	       
	    }); */

        // USERS routes ===========================================================
        // create a user
        app.post('/api/users', function(req, res) {
        	
        	var salt, hash, password;

        	var user = new User();
		    
		    password = req.body.password;
		    salt = bcrypt.genSaltSync(10);
		    hash = bcrypt.hashSync(password, salt);

        	user.username = req.body.username,
        	user.password = hash

        	user.save(function(err) {
        		if (err)
        			res.send(err);

        		res.json({ message: 'User created' });
        	})

        });

        // get users
        app.get('/api/users', function(req, res) {
            // use mongoose to get all users in the database
            User.find(function(err, users) {

                // if there is an error retrieving, send the error. 
                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.json(users); // return all horses in JSON format
            });
        });

        app.delete('/api/users/:userid', function(req, res) {
	        User.remove({
	            _id: req.params.userid
	        }, function(err, users) {
	            if (err)
	                res.send(err);

	            res.json({ message: 'Successfully deleted' });
	        });
	    }); 

        // HORSES routes ===========================================================
        // create a horse (accessed at POST http://localhost:8080/api/horses)
	    app.post('/api/horses', passport.authenticate('jwt', { session: false}), function(req, res) {

	    	var token = getToken(req.headers);

	    	if (token) {
			    var decoded = jwt.decode(token, config.secret);

			    
			    if(app.get('data')) {
			    	var imagePath = 'img/' + app.get('data');
			    } else {
			    	var imagePath = 'img/not-found.jpg';
			    }
	        
		        var horse = new Horse();      // create a new instance of the Horse model

		        console.log(req.body);

		        horse.name = req.body.name;
	            horse.slug = req.body.slug;
	            horse.breed = req.body.breed;
	            horse.sex = req.body.sex;
	            horse.color = req.body.color;
	            horse.DOB = req.body.DOB;
	            horse.regNumber = req.body.regNumber;
	            horse.breeder = req.body.breeder;
	            horse.owner = req.body.owner;
	            horse.discpline = req.body.discpline;
	            horse.photos = { 'license' : req.body.photos.license, 'owner' : req.body.photos.owner, 'ownerUrl' : req.body.photos.ownerUrl, 'imgUrl' : imagePath };
	            horse.photos.imgUrl = imagePath;
	            horse.pedigree.sire = req.body.sire;
	            horse.pedigree.dam = req.body.dam;

	            console.log(req.body.foal);
	           
	           	horse.offspring = { 'foal': mongoose.Types.ObjectId(req.body.foal) };

		        // save the horse and check for errors
		        horse.save(function(err) {
		            if (err)
		                res.send(err);

		            res.json({ message: 'Horse created!' });
		        });
	    	} else {
	    		return res.status(403).send({success: false, msg: 'No token provided.'});
	    	}
	        
	    });

	    // get all the horses (accessed at GET http://localhost:8080/api/horses)

        app.get('/api/horses', function(req, res) {

            // use mongoose to get all horses in the database
            Horse.find(function(err, horses) {
                // if there is an error retrieving, send the error. 
                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);
                res.json(horses); // return all horses in JSON format
            });
        });

        // route to handle creating goes here (app.post)
        // route to handle delete goes here (app.delete)

        // get the horse with that id (accessed at GET http://localhost:8080/api/horses/:horse_name)
	    app.get('/api/horses/:horse_name', function(req, res) {

	    	Horse
	    		.findOne({ 'slug': req.params.horse_name })
				.populate('pedigree.sire pedigree.dam offspring.foal')
				.exec(function (err, horse) {
					if (err) res.send(err);
					res.json(horse);  
				});
	    });

		// update the horse with this slug (accessed at PUT http://localhost:8080/api/horses/:horse_name)
	    app.put('/api/horses/:horse_name', passport.authenticate('jwt', { session: false}), function(req, res) {

	    	var token = getToken(req.headers);
		    	if (token) {
				    var decoded = jwt.decode(token, config.secret);

		        	// use our horse model to find the horse we want
		        	Horse.findOne({'slug': req.params.horse_name}, function(err, horse) {

		            if (err)
		                res.send(err);

		            horse.name = req.body.name;
		            horse.slug = req.body.slug;
		            horse.breed = req.body.breed;
		            horse.sex = req.body.sex;
		            horse.color = req.body.color;
		            horse.DOB = req.body.DOB;
		            horse.regNumber = req.body.regNumber;
		            horse.breeder = req.body.breeder;
		            horse.owner = req.body.owner;
		            horse.discpline = req.body.discpline;

		            if(req.body.sire != '') {
		            	horse.pedigree.sire = req.body.sire;
		            } else {
		            	horse.pedigree.sire = null;
		            }
		            if(req.body.dam != '') {
		            	horse.pedigree.dam = req.body.dam;
		            } else {
		            	horse.pedigree.dam = null;
		            }

		            // save the horse
		            horse.save(function(err) {
		                if (err)
		                    res.send(err);

		                res.json({ message: 'Horse updated!' });
		            });

		        });
	    	}
	    });

	    // delete the horse with this id (accessed at DELETE http://localhost:8080/api/horses/:horse_name)
	    app.delete('/api/horses/:horse_name', function(req, res) {
	        Horse.remove({
	            slug: req.params.horse_name
	        }, function(err, horse) {
	            if (err)
	                res.send(err);

	            res.json({ message: 'Successfully deleted' });
	        });
	    }); 

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendfile('./public/index.html'); // load our public/index.html file
        });

    };