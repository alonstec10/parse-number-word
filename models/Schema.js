var db 		= require('../db'),
	Schema 	= db.Schema;


function Schemas() {


	this.word 	=	function(){
		var wordSchema = new Schema({
		  title     	: { type: String },
		  data   		: { type: Array }
		});

		var model;
		if (db.models.words) {

		  model = db.model('words');
		
		} else {
		
		  model = db.model('words', wordSchema);
		
		}

		return model;
	};


	return this;
}

module.exports 	=	Schemas();


