"use strict";
var fs			= require('fs'), 
	utils 		= require('../utilities/utils')(), 
	words 		= require('../models/Words'), 
	should 		= require('should'),
	configs 	= require('../configs/settings'), 
	assert 		= require('assert'), 
	app 		= require('../app')(configs.files.testwords), 
	WordsObject = new words(configs.files.testwords);	


describe("Testing for Words model ", function(){

	it("Test To see if file exists ", function(done){

		//check to see if the file exists
		WordsObject.__construct(function(err, filename){
			if(!err) {
			
				assert.equal(filename, filename, "File names are equal");
				done();
			} else {
				throw err;
				done();
			}
			
		});
 	
	});

	it("Test words file, parse it, assign it to data" , function(done){

		this.timeout(10000);
		
		WordsObject.parseWordFile(function(err, data){

			if(err) {
				throw err;
				done();
			} else {

				should(WordsObject).have.property('data');
				should(WordsObject).have.property('data').with.lengthOf(data.length);
				
				done();
			}

		});

	});

});

describe("Testing Main Application", function(){

	it("Test if numbers return correct letter/word combinations ", function(done){

		this.timeout(10000);
		/*
		*/ 

		var WordCombos 	=	app.ReturnPossibleCombinations(["3", "4", "5"]);
 	
		//should be 27
		should(WordCombos).with.lengthOf(27);
		should(WordCombos).be.a.Object;

		done();
		
	});

	it("Test if words are returned ", function(done){

		//ReturnAllWords
		app.__construct(function(err,data) {

			if(err) {
				throw err;
				done();
			} else {
				//utils.LogObject(data);
				var ApplicationWords 	=	app.words.ReturnAllWords();
				
				should(ApplicationWords).with.lengthOf(data.length);
				should(ApplicationWords).be.a.Object;
				done();
			}

		});
		

	});


	it("Test potential words from WordCombos ", function(done){


		//an array of numbers
		this.timeout(10000);
		app.__construct(function(err,data) {

			if(err) {
				throw err;
				done();
			} else {

				app.GetWordCombinationsForNumbers(["4", "3", "5", "5"], function(words){

					assert.notEqual(words.indexOf('hell'), 1);

					done();

				});

				
			}

		});

		



	

		
	});







});






