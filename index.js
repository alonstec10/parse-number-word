var fs		= require('fs'), 
	app 	= require('./app'), 
	utils 	= require('./utilities/utils')(),
	settings	= require('./configs/settings'), 
	wordfile	= settings.files.words;


var WordsApplication 	=	new app(wordfile);



module.exports 	=	WordsApplication;



