// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define our nerd model
// module.exports allows us to pass this to other files when it is called
var UserSchema   = new Schema({
    username : { type: String },
    password : { type: String }
});


module.exports = mongoose.model('User', UserSchema);
