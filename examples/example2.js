var Skin = require('../lib/skin')
,	inspect = require('../lib/utils').inspect
;



var lightbox1 = {
	tag:'div'
,	classes:['ImageBox']
,	attributes:{
		width:400
	,	height:300
	}
,	style:{
		background:'#ccc'
	,	'border-color':'1px solid white'
	}
,	children:{
		TheImage:{
			tag:'img'
		,	id:'TheImage'
		,	attributes:{
				src: "http://lorempixel.com/400/200"
			,	style:{
					'background-image':'url(loader.gif)'
				}
			}
		,	value:'this will be the alt property of the image'
		}
	,	description:{
			tag:'div'
		,	classes:'description' //you don't have to enclose it in an array
		,	style:{
				'font-size':'100%'
			}
		,	value:'some nice description'
		}
	,	close:{
			tag:'a'
		,	classes:['button','close']
		,	attributes:{
				'href':'#'
			,	style:'position:absolute;top:0;left:0'
			}
		,	value:'x'
		}
	}
}

var eol = '\n';
var text = 
	 'div.ImageBox(width="400" height="300" style="background:#ccc;border-color:1px solid white")'+eol
	+'	img#TheImage(src="http://lorempixel.com/400/200" style="background-image:url(loader.gif)") this is the alt text'+eol
	+'	div.description(style="font-size:110%") This is a very nice image'+eol
	+'	a.close.button(href="#" style="position:absolute;top:0;left:0") x';
var lightbox = Skin.parse(text);

inspect(lightbox);