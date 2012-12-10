if (typeof module === 'object' && typeof define !== 'function') {
    var define =function(factory){module.exports = factory(require, exports, module);};
}

define(function (require, exports, module) {

	var toString = Object.prototype.toString;
	var slice = Array.prototype.slice;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var emptyString = '';

	var is = function(obj,type){

		if(arguments.length>2){
			var args = slice.call(arguments);
			type = args.pop();
			if(is.function(type)){type = type.name;}
			return (is.same.apply(is,args) == type.toLowerCase());
		}
		if(arguments.length == 2){
			if(is.function(type)){type = type.name;}
			return is.type(obj) == type.toLowerCase();
		}
		if(arguments.length == 1){
			return is.type(obj);
		}
		return is;
	}

	is.object = function(obj){return obj === Object(obj);}	

	is.array = function(obj){return toString.call(obj) == '[object Array]';}

	is.boolean = function(obj){return obj === true || obj === false || toString.call(obj) == '[object Boolean]';}

	is.function = function(obj){return toString.call(obj) == '[object Function]';}

	is.string = function(obj){return toString.call(obj) == '[object String]';}

	is.empty = function(obj){
		if((!is.defined(obj)) || obj == emptyString){return true;}
		if (typeof obj.length !=='undefined'){return obj.length > 0 ? true:false;}
		for (var key in obj) {
			if (hasOwnProperty.call(obj, key)){return false;}
		}
		return true;
	}

	is.defined = function(obj){return !(obj===null || typeof obj === 'undefined')}

	is.number = function(obj){return typeof(obj)==='number';}

	is.integer = function(obj){return !isNaN(obj) && parseInt(obj) == obj;}

	is.HTMLCollection = function(obj){
		var result = toString.call(obj) 
		if (
			typeof nodes === 'object'
			&&
			/^\[object (HTMLCollection|NodeList|Object)\]$/.test(result)
			&&
			nodes.hasOwnProperty('length')
			&&
			(nodes.length == 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0))
		) {
			return true;
		}
		return false;
	}

	is.arguments = function(obj){return toString.call(obj) == '[object Arguments]';}

	is.node = function(obj){return !!(obj && obj.nodeType == 1);}

	is.regexp = function(obj){return obj instanceof RegExp;}

	is.type = function(obj){
		return toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
	}

	is.same = function(){
		var oldType,newType;
		for(var i = 0; i < arguments.length; i++){
			newType = is.type(arguments[i]);
			if(i && oldType != newType){return false;}
			oldType = newType;
		}
		return newType;
	}


	return is;

});
