// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define our nerd model
// module.exports allows us to pass this to other files when it is called
var HorseSchema   = new Schema({
    name: {type: String, default: ''},
    slug: {type: String},
    //photos: [{type: Schema.Types.ObjectId, ref: 'Photo'}],
    breed: {type: String },
    stockHorse: { type: Boolean, default: false },
    foreignUrl: { type: String }, // if horse isin't living on a stable
    sex: {type: String },
    color: {type: String },
    DOB: {type: String },
    regNumber: {type: String },
    breeder: {type: String },
    owner: {type: String },
    discpline: {type: String },
    pedigree: {
        sire: { type: Schema.Types.ObjectId, ref: 'Horse' },
        dam: { type: Schema.Types.ObjectId, ref: 'Horse' }
    },
    offspring: [{
        foal: { type: Schema.Types.ObjectId, ref: 'Horse' }
    }],
    photos: [{ 
        license: { type: String },
        owner: { type: String },
        ownerUrl: { type: String },
        imgUrl: { type: String}
    }],
});


module.exports = mongoose.model('Horse', HorseSchema);
