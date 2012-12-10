var is = require('dis');

var inspect = module.exports.inspect =function(n){
	console.log(require('util').inspect(n, true,100,true));
}

var extend = module.exports.extend = function(target, other) {
	var args = Array.prototype.slice.call(arguments)
	,	important = false
	,	tVal
	,	oVal
	;
	target = args.shift();
	while(args.length){
		other = args.shift();
		if(!other || (other.length && other.length == 0)){continue;}
		for (var prop in other) {
			important = false;
			tVal = target[prop];
			oVal = other[prop];
			if(prop.indexOf('!')===0){important = true;}
			if(is.defined(tVal)){ //both are important, just get back to normal
				prop = prop.replace('!','');
				target[prop] =  tVal;
				other[prop] = oVal;
				delete target['!'+prop];
				delete other['!'+prop];
			}
			if(!important && is.defined(target['!'+prop])){
				target[prop] =  target['!'+prop];
				delete target['!'+prop];
				continue;
			}
		 	if(is.array(tVal)){
		 		if(is.array(oVal)){
		 			target[prop] = tVal.concat(oVal);
		 		}
		 		else{
		 			tVal.push(oVal);
		 		}
		 	}
			else if (is.object(oVal) && is.object(tVal)){
		 		target[prop] = extend(tVal, oVal);
			}
			else{
				target[prop] = oVal;
			}
		}
	}
	return target;
}

module.exports.cleanArray = function(arr){
	var newArr = [];
	for(var n in arr){
		if(is.defined(arr[n])){
			newArr.push(arr[n]);
		}
	}
	return newArr.filter(function(elem, pos){return newArr.indexOf(elem) == pos;});
}
