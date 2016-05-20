// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define our nerd model
// module.exports allows us to pass this to other files when it is called
var NerdSchema   = new Schema({
    name : {type: String, default: ''},
    slug: {type: String},
    photos: [{type: Schema.Types.ObjectId, ref: 'Photo'}],
    breed: {type: String },
    sex: {type: String },
    color: {type: String },
    DOB: {type: String },
    regNumber: {type: String },
    breeder: {type: String },
    owner: {type: String },
    discpline: {type: String }
});


module.exports = mongoose.model('Horse', NerdSchema);
