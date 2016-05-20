var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoSchema   = new Schema({
    title : { type: String },
    copyrights : { 
    	license: { type: String },
    	owner: { type: String },
    	ownerUrl: { type: String }
    },
    horse: { type: Schema.Types.ObjectId, ref: 'Horse'}
});


module.exports = mongoose.model('Photo', PhotoSchema);
