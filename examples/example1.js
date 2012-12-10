var Skin = require('../lib/skin')
;

Skin.register('gallery',{
	children:{
		gallery:{
			tag:'div'
		,	classes:'gallery'
		,	value:'a gallery'
		}
	}
})

var description = Skin.parse(
	'.description\n'
+	'	h3.title(style="background:red;border:1px solid black") {{title}}\n'
+	'	span.text {{text}}'
);

description.children.title.attr.style.background='#ccc'
description.children.text.attr.style = {'font-size':'90%'};

Skin.extend(description,'gallery');

descriptionFn = Skin(description);

console.log(descriptionFn.styles());
console.log(descriptionFn())