var Skin = require('../lib/skin')
,	inspect = require('../lib/utils').inspect
;

var eol = '\n';
var text = 
	 'div.ImageBox(width="400" height="300" style="background:#ccc;border-color:1px solid white")'+eol
	+'	img#TheImage(src="http://lorempixel.com/400/200" style="background-image:url(loader.gif)") this is the alt text'+eol
	+'	div.description(style="font-size:110%") This is a very nice image'+eol
	+'	a.close.button(href="#" style="position:absolute;top:0;left:0") x';
var lightbox = Skin.parse(text);

	Skin.extend(lightbox,{
		children:{
			description:{
				tag:'h3'
			,	attr:{
					classes:['big']
				,	style:{
						'font-size':'200%'
					}
				}
			,	value:'what a nice image'
			}
		}
	});

inspect(lightbox);
