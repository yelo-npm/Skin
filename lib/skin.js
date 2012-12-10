var Class = require('myclass')
,	extend = require('./utils').extend
,	clean = require('./utils').cleanArray
,	slice = Array.prototype.slice
,	is = require('dis')
;

var Skin = function(skin){
	if(arguments.length>1){
		skin = Skin.extend.apply(Skin,slice.call(arguments));
	}else if(is.string(skin)){
		skin = Skin.get(arguments[0])
	}
	if(!skin){skin={};}

	var fn = function render(vals){
		var args = slice.call(arguments)
		,	l = args.length;
		if(l>1){
			if(args[l-1]===true){args.pop();}
			args.unshift(skin);
			skin = Skin.extend.apply(Skin,args);
		}
		else if(l==1){
			skin = Skin.feed(skin,vals);
		}
		return Skin.render(skin, fn.noStyles);
	}
	fn.noStyles = false;
	fn.styles = function styles(asProcessor,removeStyles){
		if(removeStyles!==false){fn.noStyles= true;}
		return Skin.extractStyles(skin,asProcessor);
	}
	fn.toString = function(){
		return Skin.render(skin);
	}
	return fn;
}

Skin.extend = function(){
	var ancestors = slice.call(arguments)
	,	i = 0
	,	l = ancestors.length
	,	skin = {}
	,	skins = [skin]
	;
	if(!l){return skin;}
	else{
		for(i;i<l;i++){
			if(is.string(ancestors[i])){
				ancestors[i] = Skin.get(ancestors[i]);
			}
			if(ancestors[i]){skins.push(ancestors[i]);}
		}
		extend.apply(null,skins);
	}
	return Skin.normalize(skin);
}

Skin.feed = function(skin,values){
	if(is.string(values)){
		skin.value = values;
	}
	else{
		for(var n in values){
			if(skin.children && n in skin.children){
				Skin.feed(skin.children[n],values[n])
			}
		}
	}
	return skin;
}

var map = {};

Skin.extractStyles = function(skin,asProcessor,pos,ids,depth,parent){
	if(!depth){depth = 0}
	var uniqueId = ''
	,	ret = ''
	,	n
	,	usedClasses = false
	,	tabs = depth && asProcessor ? (new Array(parseInt(depth) + 1).join('\t')) : '';
	;
	if(!pos){pos = 0;}
	if(!ids){ids = [];}
		if('class' in skin.attr && skin.attr['class'].length){
			uniqueId = '.'+(is.array(skin.attr['class'])? skin.attr['class'].join('.') : skin.attr['class'].replace(' ','.'));
		}
		else{
			uniqueId = skin.id ? skin.id : skin.tag.trim()+uniqueId;
		}
		if(!uniqueId || (ids && ids.indexOf(uniqueId)>=0)){
			uniqueId+=(ids=='0')? ':first-child' : 'nth-child('+pos+')';
		}
		uniqueId = (parent? parent+' ':'')+uniqueId;
		ids.push(uniqueId);
	
	if(skin.attr.style && !is.empty(skin.attr.style)){
		ret+=tabs+(asProcessor?uniqueId.replace(parent+' ',''):uniqueId)+'{\n\t'+tabs+renderStyle(skin.attr.style).replace(/;/g,';\n\t'+tabs)+';\n';
		if(!asProcessor){ret+='}\n';}
	}
	var childPos = 0;
	var childIds = [];
	depth++;
	for(n in skin.children){
		if(skin.children[n].attr.style){
			ret+=Skin.extractStyles(skin.children[n],asProcessor,childPos,childIds,depth,uniqueId);
		}
		childPos++;
	}
	if(skin.attr.style && !is.empty(skin.attr.style) && asProcessor){
		ret+=tabs+'}\n';
	}
	return ret;
}

renderStyle = function(st){
	ret = [];
	if(is.string(st)){return st;}
	for(var n in st){
		ret.push(n+':'+st[n]);
	}
	if(ret.length){
		return ret.join(';');
	}
	return '';
}

Skin.render = function(obj, stripStyles){
	obj = Skin.normalize(obj);
	var res = ''
	,	n
	,	val
	;

	if(obj.tag){
		res+='<'+obj.tag;
		if(obj.attr){
			for(n in obj.attr){
				val = obj.attr[n];
				if(is.defined(val) && (val.length || is.object(val)) && (!stripStyles || n!=='style')){
					if(n === 'style'){val = renderStyle(val);}
					res+=' '+n+'="'+val+'"';
				}
			}
		}
		if(obj.style){
			res+=' style="';
			for(n in obj.style){
				res+=n+':'+obj.style[n]+';'
			}
			res+='"'
		}
		res+=(obj.selfClosing? '/':'' )+'>'
	}

	if(obj.text){
		res+=obj.text;
	}

	if(obj.children){
		for(var n in obj.children){
			res+=Skin.render(obj.children[n],stripStyles);
		}
	}

	if(obj.tag && !obj.selfClosing){
		res+='</'+obj.tag+'>';
	}

	return res;

}



normalizeClassProperty = function(obj){
	var poss = [];
	if('class' in obj.attr){poss = poss.concat(obj.attr['class']); delete obj.attr['class']}
	if('class' in obj){poss = poss.concat(obj['class']); delete obj['class']}
	if('classes' in obj.attr){poss = poss.concat(obj.attr['classes']); delete obj.attr['classes']}
	if('classes' in obj){poss = poss.concat(obj['classes']); obj['classes']}
	poss = poss.length ? clean(poss.join(' ').split(' ')).join(' ') : '';
	return poss;
}

normalizeStyleProperty = function(obj){
	poss = [], res = {};
	if('style' in obj){poss = poss.concat(obj.style); delete obj.style};
	if('style' in obj.attr){poss = poss.concat(obj.attr.style); delete obj.attr.style};
	if(!poss.length){return {};}
	for(var i = 0; i < poss.length; i++){
		if(is.string(poss[i])){
			poss[i] = poss[i].replace(/(.*?:.*?)\s?(;\s?|$)/g,'$1[[[]]]').split('[[[]]]');
		}
		if(is.array(poss[i])){
			for(var u = 0; u < poss[i].length; u++){
				poss[i][u] = poss[i][u].replace(';','').split(':');
				if(poss[i][u].length<2){continue;}
				res[poss[i][u].shift()] = poss[i][u].shift();
			}
		}else{
			for(var n in poss[i]){
				res[n] = poss[i][n];
			}
		}
	}
	return res;
}

var selfClosingList = {
	'img':true
,	'input':true
,	'hr':true
,	'br':true
}

Skin.normalize = function(obj){
	if(is.string(obj)){obj = Skin.get(obj);}
	if(!obj){obj={};}
	obj.tag = obj.tag || obj.tagName || '';
	obj.attr = extend({},obj.attr,obj.attributes);
	delete(obj.attributes);

	obj.attr['class'] = normalizeClassProperty(obj);

	if(obj.id){obj.attr.id = obj.id; delete obj.id;}

	obj.attr.style = normalizeStyleProperty(obj);

	if((obj.value || obj.text) && obj.tag && obj.tag == 'input'){
		obj.attr.value = obj.value || obj.text;
		delete(obj.value);
		delete(obj.text);
	}
	else if((obj.value || obj.text) && obj.tag && obj.tag == 'img'){
		obj.attr.alt = obj.value || obj.text;
		delete(obj.value);
		delete(obj.text);
	}
	else if(obj.value){
		obj.text = obj.value;
		delete(obj.value);
	}

	if(obj.tag in selfClosingList){
		obj.selfClosing = true;
	}

	if(obj.attr.checked && obj.attr.checked == true){
		obj.attr.checked = 'checked';
	}

	if(obj.children){
		for(var n in obj.children){
			obj.children[n] = Skin.normalize(obj.children[n]);
		}
	}

	return obj;
}

Skin.register = function(name,model,parse){
	if(parse){model = Skin.parse(model);}
	map[name] = model;
}

Skin.get = function(name){
	if(name in map){
		return map[name];
	}
	return false;
}

Skin.parse = function(html){
	var line
	,	i = 0
	,	l
	,	lastIndent=0
	,	stack = [{children:{}}]
	,	lastLine
	,	ids = 0
	,	curr
	,	uniqueId
	;
	html = html.replace(/\n|\r/g,'[[[]]]').split('[[[]]]');
	l = html.length
	for(i;i<l;i++){
		line = parseLine(html[i]);
		if(!line){continue;}
		//console.log(line)
		if(line.indent > lastIndent){stack.push(lastLine);}
		else if(line.indent< lastIndent){
			if(stack.length>1){stack.pop();}
		}
		curr = stack[stack.length-1];
		if(line.id){
			uniqueId = line.id
		}else{
			if(line.classes){
				for(var c in line.classes){
					if(!(line.classes[c] in curr.children)){
						uniqueId = line.classes[c];
						break;
					}
				}
			}
			if(!uniqueId){
				uniqueId = line.tag+(ids++);
			}
		}
		curr.children[uniqueId] = line;
		lastIndent = line.indent
		lastLine = line;
		delete line.indent;
	}
	return Skin.normalize(stack[1]);
}

var parseRegexes = /^(\s*)?([\w]*?|\|)?(#[\w\d-]*?)?(\.([\w\d-.]*)*?)?(\((.*)\))?((?:\s|\t)(.*?))?$/g

var parseLine = function(line){
	var match
	;
	parseRegexes.lastIndex = 0;
	while(match = parseRegexes.exec(line)){
		/**
		for(var n in match){
			console.log(n+':'+match[n]);
		}
		console.log('-----------------------------')
		/**/
		return {
			indent:match[1] ? match[1].length : 0
		,	tag:match[2] ? match[2] == '|' ? '' : match[2] : 'div'
		,	id:match[3] ? match[3].replace('#','') : ''
		,	classes:match[4] ? match[4].split('.').splice(1) : ''
		,	attributes:match[7] ? (function(attrs){
				attrs = attrs.replace(/(.*?="|'.*?'|")\s/g,'$1[[[[]]]]')
						.replace(/'|"/g,'')
						.split('[[[[]]]]');
				var res = {}
				for(var i in attrs){
					attrs[i] = attrs[i].split('=');
					res[attrs[i].shift()] = attrs[i].shift();
				}
				return res;
			})(match[7]) : {}
		,	value:match[9] ? match[9] : ''
		,	children: {}
		};
	}
}

module.exports = Skin;