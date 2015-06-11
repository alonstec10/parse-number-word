var settings	= require('./configs/settings'), 
	wordfile	= settings.files.words,
	utils 		= require('./utilities/utils')(), 
	Words 		= require('./models/Words');
 
var App = function(filepath) {

	var obj 				=	this;

	this.path 				=	filepath;
	this.numbers 	=	{   
							"0": [""],
							"1": [""],
							"2": ["a","b","c"], 
							"3": ["d", "e", "f"], 
							"4": ["g", "h", "i"], 
							"5": ["j", "k", "l"],
							"6": ["m", "n", "o"],
							"7": ["p", "q", "r", "s"],
							"8": ["t", "u", "v"],
							"9": ["w", "x", "y", "z"],
						};
	this.words 		=	{};
	this.data 		=	[];

	this.__construct 	=	function(callback){


		this.words 				=   new Words(this.path);

		//check to see if the file exists
		this.words.__construct(function(err, filename){
			if(!err) {
				
				obj.words.parseWordFile(function(err, data){

					if(err) {
						//throw err;
						
						callback(err, {});
					} else {


						obj.data 	=	obj.words.ReturnAllWords();

						callback(err, obj.data);
					}
				});
			} else {
				callback(err, {});
				//throw err;
			}
			
		});
	
	};

	//send numbers 
	//takes array gives back possible letters for each number
	this.ReturnNumberLetters 	=	function(array){

		var info 			=	{ letters: [], combinations: 1, length: array.length };

		if(array.length > 0) {
			arguments = array;
			for(var i = 0; i < arguments.length; i++) {
				for (var j in this.numbers) {
					if(j === arguments[i]) {
						info.letters.push(this.numbers[j]);
						info.combinations = this.numbers[j].length * info.combinations;
					}
				};
			}

		}
		
		return info;
	};

	this.recurse 	=	function(str, array) {
	
		var combinations 	=	[];

		if(typeof array === 'object') {
			
			//console.log("array length: " + array.length);

			for (var j in array) {
				var combine_string 	=	str + array[j];

				//console.log("combine string: " + combine_string);

				combinations.push(str + array[j])
			};
		};
		return combinations.join(",");
	}; 


	this.ReturnPossibleCombinations 	=	function(array){

		var combos, groups, combine_strings 	=	[];


		if(!array || typeof array !== 'object') {
			throw "Paramter not correct";
			return;
		}

		
		combos 	=	this.ReturnNumberLetters(array);

		var combine_strings 	=	[];
			groups 				=	combos.letters;

		while(true) {
			
			if(groups[0] && groups[1]) {

					var temp_array 	=	new Array();

					for(var j in groups[0]) {
								
						var string 			=	groups[0][j];
						var c 				=	this.recurse(string, groups[1]);

						temp_array.push(c);
					
					};
					
					groups.shift();
					groups.shift();
					
					groups.unshift(temp_array.join(",").split(","));
			
				}

				if(groups && groups.length == 1) break;

			}
		
		return groups[0];
	};


	this.CheckWordAgainstLetter		=	function(letter, word) {

		for (var i = 0; i < word.length; i++) {
			

			var wordLetter 	= word.substr(0, letter.length).toLowerCase();//         word[i].toLowerCase();
			
			//utils.log("word letter: ", wordLetter, " letter ", letter, " word ", word);

			if (letter == wordLetter) {
				//utils.log("we match this letter : ", word, letter, wordLetter);

				return true;	
			}
			else return false;
		};


	};

	this.FindWord		=	function(str, array) {


		var found_words 	=	new Array();


		for (var j = 0; j < array.length; j++) {
				
				var word = array[j];
				//utils.log("word: ", word);
				
				var letter = '';

				for(var i = 0; i < str.length; i++) {
					//we got the letter
					letter 		+=	str[i];

					//utils.log("letter: ", letter, "\n");

					if(this.CheckWordAgainstLetter(letter, word)) {
						
						var reg 	=	new RegExp(str,"g");

						if(str.length > 1 && str.length <= word.length && word.match(reg)) {
							//utils.log("WE HAVE A MATCH ", word);
							
							found_words.push(word);
							
							break;							
						} else if(str.length === 1 && str.length == word.length){
							found_words.push(word);
							
							break;
						}
						continue;	
					} else {
						break;
					}
					
				}

		}
		return found_words;

	};


	this.GetWordCombinationsForNumbers 		=	function(array, callback){

		var DataWords 				=	this.data;

		var sqrt 					=	Math.ceil(Math.sqrt(DataWords.length));

		var BreakArrayWords 		=	new Array();

		//break up words array
		//easier to search multiple piles
		while(DataWords.length > 0) {

			BreakArrayWords.push(DataWords.splice(0, sqrt));

		}

		//utils.LogObject(BreakArrayWords);

		var groups_to_look		=	{};
		
		var potential_finds 	=	new Array();

		var potentialwords 		=	this.ReturnPossibleCombinations(array);


		for(var i in potentialwords) {
		
			//first letter
			var word 		=	potentialwords[i];
			
			//utils.log("word ", BreakArrayWords);

			for(var j = BreakArrayWords.length-1; j >= 0; j--) {

				var group 				=	BreakArrayWords[j];
				var firstword 			= 	group[0].toLowerCase();
				var lastWord 			=	group[group.length-1].toLowerCase();

				var nextgroup, nextGroupLastWord;
				if(BreakArrayWords[j-1]){
					nextgroup 			=	BreakArrayWords[j-1];
					nextGroupFirstWord 	=	nextgroup[0].toLowerCase();
					//utils.log(nextgroup.length);
				} else {
					nextgroup 			=	group;
					nextGroupFirstWord 	=	group[0];
				}

				//utils.LogObject(nextgroup);

				if(word >= firstword  && word <= lastWord) {
					//use group
					//utils.log("word first char ", word.charAt(0), " first word first char ", firstword.charAt(0).toLowerCase(), "word ", word, " next group first word ", nextGroupFirstWord);
					//utils.log(group);
					
					if(!groups_to_look[j]) {
						groups_to_look[j] 	=	group;
					}

					

				} 

			}
		};
 
		//utils.LogObject(groups_to_look);
		//for(var p in groups_to_look) {
		//	utils.log("key ", p);
		//}

		var potential_finds 	=	new Array();

		for(var i in potentialwords) {
			
			var word 	=	potentialwords[i];
			
			for(var k in groups_to_look) {
				var array 	=	groups_to_look[k];

				var words = this.FindWord(word, array);

				if(words != '') {
					potential_finds.push(words);
				}

			}

		}

		potential_finds 	=	potential_finds.join(",").split(",");


		//bug found -- add data back
		//maybe not the best way!!! lol
		this.data 	=	BreakArrayWords.join(',').split(',');

		callback(potential_finds);
		//return potential_finds;

	};



	



	return this;
};

module.exports 	=	function(filepath) {
	var resource =	new App(filepath);
	resource.__construct(function(err, data){
	if(!err && data) {
		utils.log("Parse Number Word Loaded");
	}
});

	return resource;
};