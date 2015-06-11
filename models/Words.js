'use strict';
var fs 		= require('fs'),
	utils 	= require('../utilities/utils')();


var Words 	=	function(filepath) {
		
	var obj 	=	this;
	
	this.path 	=	filepath;
	this.data	=	new Array();

	this.__construct 	=	function(callback){

		try {

			//utils.log("filepath: ", path.filepath);
			if(!this.path || this.path.length <= 0) throw { message : 'File path parameter not given'};

			fs.open(filepath,'r',  function(err, fd){

				if(err) {
					//utils.log("File does not exist");
					callback("File does not exist", undefined);
					throw "a " + err.message;
					fs.close();
				} else {
					//utils.log("File exists - ", "fd: " + fd, " path ", obj.path);
					callback(err, filepath);
					//obj.parseWords(callback);
					fs.close(fd);
				}
				 
			});


		} catch(e) {
			//utils.log("123 " + e.message);
			callback("meh: " + e.message, 0);
			
		}

		
	};
	
	this.parseWordFile 		=	function(callback){

		try {
			//utils.log("parse words: ", this.path);
			if(this.path.length <= 0) throw {message: 'No Filepath set.'};
				//utils.log("path: ", this.path);
				fs.readFile(this.path, 'utf-8', function(err, data){
					
					if(err) {
						utils.log(err);
						callback(err, {});
						fs.close();
						throw err;	
					}
					else {
 
						//utils.log("data type : " + typeof data);
						//remove return carriages
						var data 	=	data.replace(/\n/g,"|");
						data 		=	data.split("|");
						obj.setData(data, callback);
						//fs.close();
					} 

				});

			
		} catch(e) {
				utils.log(e);
				callback(e.message, {});
		}
		

	};

	this.setData 		=	function(data, callback) {

		try {

			if(data && typeof data === 'object' && data.length > 0) {
				
				//clean up the data
				var json_string 	=	JSON.stringify(data);
				var json_object 	=	JSON.parse(json_string);

				obj.data 	=	json_object;
				callback(null, obj.data);
		
			} else {
				throw { message : 'Data was not correct'};
			}

		} catch(e) {

			callback(e.message, false);
		
		}
	};

	this.ReturnAllWords 	=	function(){

		if(this.data) {
			return this.data;
		} else {
			throw 'There are no words set';
			return [];
		}

	};
 	/*
	this.InsertData 	=	function(callback){

		//utils.log("insert data: ", this.data);
		//so we dont double up on data
		wordSchema.findOne({title: "Words"}, function(err, doc){

			if(!err) {
				//utils.log("there is no error");
				//utils.log("type ", typeof doc);
				//utils.LogObject(doc);

				if(doc) {
					callback(err, doc);
				} else {
					var WordData 		=	{ title: "Words", data: obj.data};

					var InsertWordData 	=	new wordSchema(WordData);

					///utils.log(InsertWordData);

					InsertWordData.save(function(err, InsertWordData){

						if(err) {
							callback(err, {});
						} else {
							callback(err, InsertWordData);
						}

					});
				}



			}
		});
	};
	*/
	


	return this;
};

module.exports 	=	function(filepath) {
	//utils.log("filepath: ", filepath);
	var model 	=	new Words(filepath);

	return model;
}