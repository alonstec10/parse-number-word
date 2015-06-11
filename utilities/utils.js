module.exports 	=	function(){



	this.log 	=	function(string){
		var str = '';
    	for(var i = 0; i < arguments.length; i++) {
    		str+= arguments[i] + ' ';
    	}

    	console.log(str);
	};

	this.LogObject	=	function(obj) {
		if(typeof obj === 'object') {
			for(var j in obj) {
				this.log("key ", j, " value", obj[j]);
			}
		}
	}


	return this;
};